// ============================================================
// POI Explorer - Main Application
// ============================================================

(function () {
  'use strict';

  // --- State ---
  const STATE_KEY = 'poi-explorer-state';
  let state = loadState();
  let map = null;
  let markers = [];
  let baseMarker = null;

  // --- Seed Data (parsed from Google Maps directions URL) ---
  const SEED_POIS = [
    { id: 'seed_01', name: "Galleria dell'Accademia di Firenze", description: 'Via Ricasoli, 58/60, 50129 Firenze', lat: 43.7768145, lng: 11.2586424, visited: false },
    { id: 'seed_02', name: "Cenacolo di Sant'Apollonia", description: 'Via Ventisette Aprile, 1, 50129 Firenze', lat: 43.7787202, lng: 11.2565943, visited: false },
    { id: 'seed_03', name: 'Medici Riccardi Palace', description: 'Via Camillo Cavour, 3, 50129 Firenze', lat: 43.7751689, lng: 11.2558581, visited: false },
    { id: 'seed_04', name: 'Cappelle Medicee', description: 'Piazza di Madonna degli Aldobrandini, 6, 50123 Firenze', lat: 43.7750913, lng: 11.2533903, visited: false },
    { id: 'seed_05', name: 'Basilica of Santa Maria Novella', description: 'P.za di Santa Maria Novella, 18, 50123 Firenze', lat: 43.7746346, lng: 11.2493859, visited: false },
    { id: 'seed_06', name: 'Piazza del Duomo', description: '50122 Firenze', lat: 43.7734385, lng: 11.2565501, visited: false },
    { id: 'seed_07', name: 'Fontana del Porcellino', description: 'Piazza del Mercato Nuovo, 50123 Firenze', lat: 43.7698943, lng: 11.2542408, visited: false },
    { id: 'seed_08', name: 'Piazza della Signoria', description: 'P.za della Signoria, 50122 Firenze', lat: 43.7696855, lng: 11.2556422, visited: false },
    { id: 'seed_09', name: 'Museo Nazionale del Bargello', description: 'Via del Proconsolo, 4, 50122 Firenze', lat: 43.7703981, lng: 11.2580078, visited: false },
    { id: 'seed_10', name: 'Basilica of Santa Croce in Florence', description: 'Piazza di Santa Croce, 16, 50122 Firenze', lat: 43.7685683, lng: 11.2622677, visited: false }
  ];

  function defaultState() {
    return {
      baseLocation: null, // { lat, lng, label }
      pois: [],           // [{ id, name, description, lat, lng, visited }]
      currentView: 'map'
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) return { ...defaultState(), ...JSON.parse(raw) };
    } catch (e) { /* ignore */ }
    // First launch: seed with Florence POIs
    const initial = defaultState();
    initial.pois = SEED_POIS.map(p => ({ ...p }));
    return initial;
  }

  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  // --- Geocoding (Nominatim) ---
  let geocodeTimeout = null;

  async function geocode(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' }
    });
    if (!res.ok) throw new Error('Geocoding failed');
    return res.json();
  }

  function renderSearchResults(results, container, onSelect) {
    container.innerHTML = '';
    results.forEach(r => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.textContent = r.display_name;
      div.addEventListener('click', () => {
        onSelect({
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
          label: r.display_name
        });
        container.innerHTML = '';
      });
      container.appendChild(div);
    });
  }

  // --- Geo Math ---
  function toRad(deg) { return deg * Math.PI / 180; }
  function toDeg(rad) { return rad * 180 / Math.PI; }

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function bearing(lat1, lng1, lat2, lng2) {
    const dLng = toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
              Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }

  function cardinalDirection(bearingDeg) {
    if (bearingDeg >= 315 || bearingDeg < 45) return 'North';
    if (bearingDeg >= 45 && bearingDeg < 135) return 'East';
    if (bearingDeg >= 135 && bearingDeg < 225) return 'South';
    return 'West';
  }

  function formatDistance(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    if (km < 10) return `${km.toFixed(1)} km`;
    return `${Math.round(km)} km`;
  }

  function googleMapsUrl(lat, lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  // --- Map ---
  function initMap() {
    const center = state.baseLocation
      ? [state.baseLocation.lat, state.baseLocation.lng]
      : [41.9028, 12.4964]; // Default: Rome

    map = L.map('map', {
      center: center,
      zoom: state.baseLocation ? 13 : 6,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    renderMapMarkers();
  }

  function renderMapMarkers() {
    // Clear existing
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    if (baseMarker) {
      map.removeLayer(baseMarker);
      baseMarker = null;
    }

    // Base marker
    if (state.baseLocation) {
      const baseIcon = L.divIcon({
        className: 'base-marker-icon',
        html: '<div class="base-marker-dot"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      baseMarker = L.marker([state.baseLocation.lat, state.baseLocation.lng], {
        icon: baseIcon,
        zIndexOffset: -100
      }).addTo(map);
      baseMarker.bindPopup('<div class="popup-title">Base Location</div>');
    }

    // POI markers
    state.pois.forEach(poi => {
      const isVisited = poi.visited;
      const markerIcon = isVisited
        ? L.divIcon({
            className: 'visited-marker-icon',
            html: '<div class="visited-marker-pin"><span class="visited-check">\u2713</span></div>',
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28]
          })
        : undefined; // use default Leaflet marker

      const markerOpts = markerIcon ? { icon: markerIcon } : {};
      const marker = L.marker([poi.lat, poi.lng], markerOpts).addTo(map);

      const toggleLabel = isVisited ? 'Mark unvisited' : 'Mark visited';
      const popupHtml = `
        <div class="popup-title${isVisited ? ' popup-visited' : ''}">${isVisited ? '\u2713 ' : ''}${escapeHtml(poi.name)}</div>
        ${poi.description ? `<div class="popup-desc">${escapeHtml(poi.description)}</div>` : ''}
        <div class="popup-actions">
          <a class="popup-link" href="${googleMapsUrl(poi.lat, poi.lng)}" target="_blank" rel="noopener">Open in Maps</a>
          <a class="popup-toggle-visited" href="#" data-poi-id="${poi.id}">${toggleLabel}</a>
          <a class="popup-edit" href="#" data-poi-id="${poi.id}">Edit</a>
        </div>
      `;
      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const editLink = document.querySelector(`.popup-edit[data-poi-id="${poi.id}"]`);
        if (editLink) {
          editLink.addEventListener('click', (e) => {
            e.preventDefault();
            marker.closePopup();
            openEditPoi(poi.id);
          });
        }
        const toggleLink = document.querySelector(`.popup-toggle-visited[data-poi-id="${poi.id}"]`);
        if (toggleLink) {
          toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleVisited(poi.id);
          });
        }
      });
      markers.push(marker);
    });

    // Fit bounds if we have markers
    if (state.pois.length > 0) {
      const allPoints = state.pois.map(p => [p.lat, p.lng]);
      if (state.baseLocation) {
        allPoints.push([state.baseLocation.lat, state.baseLocation.lng]);
      }
      if (allPoints.length > 1) {
        map.fitBounds(allPoints, { padding: [40, 40] });
      }
    }
  }

  // --- List View ---
  function renderListView() {
    const container = document.getElementById('poi-list');

    if (!state.baseLocation) {
      container.innerHTML = '<div class="empty-list">Set your base location in Settings to see POIs sorted by distance and direction.</div>';
      return;
    }

    if (state.pois.length === 0) {
      container.innerHTML = '<div class="empty-list">No points of interest yet.<br>Tap + to add one.</div>';
      return;
    }

    // Calculate distance and direction for each POI
    const enriched = state.pois.map(poi => {
      const dist = haversineDistance(state.baseLocation.lat, state.baseLocation.lng, poi.lat, poi.lng);
      const bear = bearing(state.baseLocation.lat, state.baseLocation.lng, poi.lat, poi.lng);
      return { ...poi, distance: dist, bearing: bear, direction: cardinalDirection(bear) };
    });

    // Sort by distance
    enriched.sort((a, b) => a.distance - b.distance);

    // Group by direction
    const directionOrder = ['North', 'East', 'South', 'West'];
    const directionArrows = { North: '\u2191', East: '\u2192', South: '\u2193', West: '\u2190' };
    const groups = {};
    directionOrder.forEach(d => groups[d] = []);
    enriched.forEach(poi => groups[poi.direction].push(poi));

    let html = '';
    directionOrder.forEach(dir => {
      const items = groups[dir];
      if (items.length === 0) return;

      html += `<div class="direction-group">`;
      html += `<div class="direction-header">
        <span class="direction-arrow">${directionArrows[dir]}</span> ${dir}
      </div>`;

      items.forEach(poi => {
        const visitedClass = poi.visited ? ' poi-card--visited' : '';
        const visitedBtnLabel = poi.visited ? '\u2713 Visited' : 'Mark visited';
        const visitedBtnClass = poi.visited ? 'poi-card-visited-btn poi-card-visited-btn--active' : 'poi-card-visited-btn';
        html += `
          <div class="poi-card${visitedClass}" data-poi-id="${poi.id}">
            <div class="poi-card-header">
              <span class="poi-card-name">${poi.visited ? '<span class="visited-badge">\u2713</span> ' : ''}${escapeHtml(poi.name)}</span>
              <span class="poi-card-distance">${formatDistance(poi.distance)}</span>
            </div>
            ${poi.description ? `<div class="poi-card-desc">${escapeHtml(poi.description)}</div>` : ''}
            <div class="poi-card-actions">
              <a class="poi-card-link" href="${googleMapsUrl(poi.lat, poi.lng)}" target="_blank" rel="noopener">Open in Maps</a>
              <button class="${visitedBtnClass}" data-toggle-id="${poi.id}">${visitedBtnLabel}</button>
              <button class="poi-card-edit" data-edit-id="${poi.id}">Edit</button>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    container.innerHTML = html;

    // Attach edit handlers
    container.querySelectorAll('.poi-card-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditPoi(btn.dataset.editId);
      });
    });

    // Attach visited toggle handlers
    container.querySelectorAll('.poi-card-visited-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVisited(btn.dataset.toggleId);
      });
    });
  }

  // --- Modals ---
  function openModal(id) {
    document.getElementById(id).classList.add('open');
  }

  function closeModal(id) {
    document.getElementById(id).classList.remove('open');
  }

  // --- POI CRUD ---
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function openAddPoi() {
    document.getElementById('poi-modal-title').textContent = 'Add Point of Interest';
    document.getElementById('poi-name').value = '';
    document.getElementById('poi-description').value = '';
    document.getElementById('poi-address').value = '';
    document.getElementById('poi-lat').value = '';
    document.getElementById('poi-lng').value = '';
    document.getElementById('poi-id').value = '';
    document.getElementById('poi-coords-display').textContent = '';
    document.getElementById('poi-search-results').innerHTML = '';
    document.getElementById('poi-visited').checked = false;
    document.getElementById('visited-toggle-row').style.display = 'none';
    document.getElementById('btn-delete-poi').style.display = 'none';
    openModal('poi-modal');
  }

  function openEditPoi(id) {
    const poi = state.pois.find(p => p.id === id);
    if (!poi) return;

    document.getElementById('poi-modal-title').textContent = 'Edit Point of Interest';
    document.getElementById('poi-name').value = poi.name;
    document.getElementById('poi-description').value = poi.description || '';
    document.getElementById('poi-address').value = '';
    document.getElementById('poi-lat').value = poi.lat;
    document.getElementById('poi-lng').value = poi.lng;
    document.getElementById('poi-id').value = poi.id;
    document.getElementById('poi-coords-display').textContent = `${poi.lat.toFixed(5)}, ${poi.lng.toFixed(5)}`;
    document.getElementById('poi-search-results').innerHTML = '';
    document.getElementById('poi-visited').checked = !!poi.visited;
    document.getElementById('visited-toggle-row').style.display = 'flex';
    document.getElementById('btn-delete-poi').style.display = 'inline-block';
    openModal('poi-modal');
  }

  function savePoi() {
    const name = document.getElementById('poi-name').value.trim();
    const description = document.getElementById('poi-description').value.trim();
    const lat = parseFloat(document.getElementById('poi-lat').value);
    const lng = parseFloat(document.getElementById('poi-lng').value);
    const id = document.getElementById('poi-id').value;
    const visited = document.getElementById('poi-visited').checked;

    if (!name) {
      alert('Please enter a name.');
      return;
    }
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please search for a location.');
      return;
    }

    if (id) {
      // Update
      const idx = state.pois.findIndex(p => p.id === id);
      if (idx !== -1) {
        state.pois[idx] = { ...state.pois[idx], name, description, lat, lng, visited };
      }
    } else {
      // Create
      state.pois.push({ id: generateId(), name, description, lat, lng, visited: false });
    }

    saveState();
    closeModal('poi-modal');
    renderMapMarkers();
    renderListView();
  }

  function toggleVisited(id) {
    const poi = state.pois.find(p => p.id === id);
    if (!poi) return;
    poi.visited = !poi.visited;
    saveState();
    renderMapMarkers();
    renderListView();
  }

  function deletePoi() {
    const id = document.getElementById('poi-id').value;
    if (!id) return;
    if (!confirm('Delete this point of interest?')) return;

    state.pois = state.pois.filter(p => p.id !== id);
    saveState();
    closeModal('poi-modal');
    renderMapMarkers();
    renderListView();
  }

  // --- Base Location ---
  function setBaseLocation(loc) {
    state.baseLocation = loc;
    saveState();
    renderMapMarkers();
    renderListView();

    if (map) {
      map.setView([loc.lat, loc.lng], 13);
    }
  }

  function handleGPS(onSuccess) {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        onSuccess({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Current Location'
        });
      },
      () => alert('Unable to get your location. Please check your permissions.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // --- Utility ---
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- View Toggle ---
  function setView(view) {
    state.currentView = view;
    saveState();

    document.getElementById('map-view').classList.toggle('active', view === 'map');
    document.getElementById('list-view').classList.toggle('active', view === 'list');

    const icon = document.getElementById('view-icon');
    icon.innerHTML = view === 'map' ? '&#9776;' : '&#9872;';

    if (view === 'map') {
      setTimeout(() => map && map.invalidateSize(), 100);
    } else {
      renderListView();
    }
  }

  // --- Wire Up Events ---
  function init() {
    initMap();

    // View toggle
    document.getElementById('btn-toggle-view').addEventListener('click', () => {
      setView(state.currentView === 'map' ? 'list' : 'map');
    });

    // Settings
    document.getElementById('btn-settings').addEventListener('click', () => {
      const display = document.getElementById('base-coords-display');
      if (state.baseLocation) {
        display.textContent = `${state.baseLocation.lat.toFixed(5)}, ${state.baseLocation.lng.toFixed(5)}`;
      } else {
        display.textContent = '';
      }
      document.getElementById('base-search-results').innerHTML = '';
      openModal('settings-modal');
    });

    // Settings: geocode base
    document.getElementById('btn-geocode-base').addEventListener('click', async () => {
      const query = document.getElementById('base-address').value.trim();
      if (!query) return;
      const btn = document.getElementById('btn-geocode-base');
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const results = await geocode(query);
        renderSearchResults(results, document.getElementById('base-search-results'), (loc) => {
          setBaseLocation(loc);
          document.getElementById('base-coords-display').textContent = `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
          document.getElementById('base-address').value = '';
        });
      } catch (e) {
        alert('Search failed. Please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Search';
      }
    });

    // Settings: GPS
    document.getElementById('btn-use-gps').addEventListener('click', () => {
      handleGPS((loc) => {
        setBaseLocation(loc);
        document.getElementById('base-coords-display').textContent = `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
        document.getElementById('base-address').value = '';
        document.getElementById('base-search-results').innerHTML = '';
      });
    });

    // Add POI buttons
    document.getElementById('btn-add-poi').addEventListener('click', openAddPoi);
    document.getElementById('btn-add-poi-list').addEventListener('click', openAddPoi);

    // POI: geocode
    document.getElementById('btn-geocode-poi').addEventListener('click', async () => {
      const query = document.getElementById('poi-address').value.trim();
      if (!query) return;
      const btn = document.getElementById('btn-geocode-poi');
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const results = await geocode(query);
        renderSearchResults(results, document.getElementById('poi-search-results'), (loc) => {
          document.getElementById('poi-lat').value = loc.lat;
          document.getElementById('poi-lng').value = loc.lng;
          document.getElementById('poi-coords-display').textContent = `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
          document.getElementById('poi-address').value = '';
        });
      } catch (e) {
        alert('Search failed. Please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Search';
      }
    });

    // POI: save / delete
    document.getElementById('btn-save-poi').addEventListener('click', savePoi);
    document.getElementById('btn-delete-poi').addEventListener('click', deletePoi);

    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(btn.dataset.close);
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });

    // Enter key for search inputs
    document.getElementById('base-address').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btn-geocode-base').click();
    });
    document.getElementById('poi-address').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btn-geocode-poi').click();
    });

    // Welcome modal (first launch)
    if (!state.baseLocation) {
      openWelcomeModal();
    }

    // Restore view
    setView(state.currentView);
  }

  // --- Welcome Flow ---
  function openWelcomeModal() {
    openModal('welcome-modal');

    document.getElementById('btn-geocode-welcome').addEventListener('click', async () => {
      const query = document.getElementById('welcome-address').value.trim();
      if (!query) return;
      const btn = document.getElementById('btn-geocode-welcome');
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const results = await geocode(query);
        renderSearchResults(results, document.getElementById('welcome-search-results'), (loc) => {
          setBaseLocation(loc);
          document.getElementById('welcome-coords-display').textContent = `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
          closeModal('welcome-modal');
        });
      } catch (e) {
        alert('Search failed. Please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Search';
      }
    });

    document.getElementById('welcome-address').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btn-geocode-welcome').click();
    });

    document.getElementById('btn-use-gps-welcome').addEventListener('click', () => {
      handleGPS((loc) => {
        setBaseLocation(loc);
        closeModal('welcome-modal');
      });
    });
  }

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // --- Start ---
  document.addEventListener('DOMContentLoaded', init);
})();
