// ============================================================
// POI Explorer - Main Application
// ============================================================

(function () {
  'use strict';

  // --- Category Config ---
  const CATEGORIES = {
    sight: { emoji: '\u{1F441}', label: 'Sight', color: '#4a90d9' },
    food:  { emoji: '\u{1F37D}', label: 'Food', color: '#e88a3a' },
    shopping: { emoji: '\u{1F6D2}', label: 'Shopping', color: '#9b59b6' }
  };

  function categoryIcon(cat) {
    return (CATEGORIES[cat] || CATEGORIES.sight).emoji;
  }

  function categoryColor(cat) {
    return (CATEGORIES[cat] || CATEGORIES.sight).color;
  }

  // --- Seed Data ---
  const SEED_POIS = [
    // === Florence - Sights ===
    { id: 'seed_01', name: "Galleria dell'Accademia di Firenze", description: "Home of Michelangelo's David", lat: 43.7768145, lng: 11.2586424, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_02', name: "Cenacolo di Sant'Apollonia", description: 'Last Supper by Andrea del Castagno', lat: 43.7787202, lng: 11.2565943, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_03', name: 'Medici Riccardi Palace', description: 'Museum - ask to see tomb underneath', lat: 43.7751689, lng: 11.2558581, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_04', name: 'Cappelle Medicee', description: 'Art museum - Medici Chapel', lat: 43.7750913, lng: 11.2533903, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_05', name: 'Basilica of Santa Maria Novella', description: 'P.za di Santa Maria Novella, 18, 50123 Firenze', lat: 43.7746346, lng: 11.2493859, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_06', name: 'Cathedral of Santa Maria del Fiore', description: 'The Duomo - free inside, not the dome', lat: 43.7731015, lng: 11.2565742, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_07', name: 'Fontana del Porcellino', description: 'Piazza del Mercato Nuovo, 50123 Firenze', lat: 43.7698943, lng: 11.2542408, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_08', name: 'Piazza della Signoria', description: 'P.za della Signoria, 50122 Firenze', lat: 43.7696855, lng: 11.2556422, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_09', name: 'Museo Nazionale del Bargello', description: 'Via del Proconsolo, 4, 50122 Firenze', lat: 43.7703981, lng: 11.2580078, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_10', name: 'Basilica of Santa Croce in Florence', description: 'Basilica - free to go inside', lat: 43.7685683, lng: 11.2622677, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_11', name: 'Giunti Odeon - Libreria e Cinema', description: 'Movie theater - free theater', lat: 43.7709955, lng: 11.2525895, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_12', name: 'Oltrarno', description: 'Cute artisan streets', lat: 43.766103, lng: 11.2504739, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_13', name: 'Ponte Vecchio', description: 'Historic bridge', lat: 43.7680255, lng: 11.253158, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_14', name: 'Palazzo Vecchio', description: 'Museum / historic palace', lat: 43.7691435, lng: 11.2561399, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_15', name: 'Boboli Gardens', description: 'Historic gardens behind Pitti Palace', lat: 43.7632781, lng: 11.2498992, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_16', name: 'Museo Leonardo Da Vinci Firenze', description: 'Leonardo Da Vinci museum', lat: 43.7749655, lng: 11.2590086, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_17', name: 'Uffizi Galleries', description: 'World-renowned art museum', lat: 43.7683129, lng: 11.2558009, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_18', name: 'Terrazza San Miniato', description: 'Sunset viewpoint', lat: 43.7628279, lng: 11.2649932, visited: false, category: 'sight', imageUrl: null },

    // === Florence - Food ===
    { id: 'seed_19', name: 'Sapori & Dintorni Conad', description: 'Supermarket / grocery', lat: 43.7672117, lng: 11.253012, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_20', name: "Pino's Sandwiches - Salumeria Verdi", description: 'Sandwich shop, lunch', lat: 43.7704543, lng: 11.2618188, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_21', name: 'Mercato Centrale', description: 'Food market', lat: 43.7765847, lng: 11.2532087, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_22', name: 'Mercato di Sant\'Ambrogio', description: 'Local indoor fresh food market', lat: 43.7704822, lng: 11.2667825, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_23', name: "All'Antico Vinaio", description: 'Famous sandwich shop', lat: 43.7684668, lng: 11.2574228, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_24', name: 'Pastasciutta', description: 'Italian restaurant', lat: 43.76813, lng: 11.2582023, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_25', name: 'Pegna dal 1860', description: 'Gourmet grocery store', lat: 43.7721126, lng: 11.256874, visited: false, category: 'food', imageUrl: null },

    // === Florence - Shopping ===
    { id: 'seed_26', name: 'Massimo Leather', description: 'Leather goods store', lat: 43.7740984, lng: 11.2548572, visited: false, category: 'shopping', imageUrl: null },
    { id: 'seed_27', name: 'Scuola del Cuoio', description: 'Leather school and shop', lat: 43.7676053, lng: 11.2630697, visited: false, category: 'shopping', imageUrl: null },
    { id: 'seed_28', name: 'Il Bisonte Florence', description: 'Leather goods store', lat: 43.7706732, lng: 11.2498607, visited: false, category: 'shopping', imageUrl: null },
    { id: 'seed_29', name: 'Manufactus Made in Italy', description: 'Artisan leather handicrafts', lat: 43.7720861, lng: 11.2498358, visited: false, category: 'shopping', imageUrl: null },
    { id: 'seed_30', name: 'Emporio Centrale', description: 'Souvenirs', lat: 43.7715393, lng: 11.2553313, visited: false, category: 'shopping', imageUrl: null },
    { id: 'seed_31', name: 'Il Torchio di Erin Ciulla', description: 'Bookbinder - journals', lat: 43.7661687, lng: 11.2556519, visited: false, category: 'shopping', imageUrl: null },
    { id: 'seed_32', name: 'The Bussetto Florence', description: 'Artisan shop', lat: 43.7702686, lng: 11.2539922, visited: false, category: 'shopping', imageUrl: null },
    { id: 'seed_33', name: 'Alberto Cozzi Rilegatore Firenze', description: 'Stationery store / bookbinder', lat: 43.7706879, lng: 11.2497245, visited: false, category: 'shopping', imageUrl: null },

    // === Tuscany ===
    { id: 'seed_34', name: 'Montefioralle', description: 'Village near Greve in Chianti', lat: 43.5807486, lng: 11.3031726, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_35', name: 'Lucca', description: 'Historic walled city', lat: 44.0177639, lng: 10.45443, visited: false, category: 'sight', imageUrl: null },

    // === Bologna ===
    { id: 'seed_36', name: 'Mercato Albani', description: 'Food hall - Bolognina', lat: 44.510293, lng: 11.3440196, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_37', name: 'Rocchetta Mattei', description: 'Castle with black and white stripes', lat: 44.2236107, lng: 11.0595976, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_38', name: 'Dozza', description: 'Hilltop city covered in murals', lat: 44.3593911, lng: 11.6288788, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_39', name: 'Sfoglia Rina', description: 'Fresh pasta restaurant', lat: 44.493182, lng: 11.3463396, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_40', name: 'Santuario Madonna di San Luca', description: 'Hilltop basilica / sanctuary', lat: 44.479093, lng: 11.2981656, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_41', name: 'Mercato delle Erbe', description: 'Food market', lat: 44.4960716, lng: 11.3382767, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_42', name: 'Quadrilatero', description: 'Historic district with food shops', lat: 44.4931597, lng: 11.3450991, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_43', name: 'Mercato di Mezzo', description: 'Food market / food hall', lat: 44.4933868, lng: 11.3448488, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_44', name: 'Portici di Bologna', description: 'UNESCO World Heritage porticoes', lat: 44.4913732, lng: 11.3454499, visited: false, category: 'sight', imageUrl: null },

    // === Emilia-Romagna (north) ===
    { id: 'seed_45', name: 'Museum Ferrari Maranello', description: 'Ferrari automobile museum', lat: 44.5301089, lng: 10.8610977, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_46', name: 'Lamborghini Automobile Museum', description: 'Lamborghini museum', lat: 44.6591378, lng: 11.1258279, visited: false, category: 'sight', imageUrl: null },
    { id: 'seed_47', name: 'Modena', description: 'City famous for balsamic vinegar', lat: 44.5384728, lng: 10.9359609, visited: false, category: 'food', imageUrl: null },
    { id: 'seed_48', name: 'Caseificio Bio Reggiani', description: 'Cheese shop', lat: 44.6994283, lng: 10.6284516, visited: false, category: 'food', imageUrl: null }
  ];

  // --- State ---
  const STATE_KEY = 'poi-explorer-state';
  let map = null;
  let markers = [];
  let baseMarker = null;
  let userLocationMarker = null;
  let userAccuracyCircle = null;
  let watchId = null;
  let userLatLng = null;

  function defaultState() {
    return {
      baseLocation: null,
      pois: [],
      currentView: 'map'
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const saved = { ...defaultState(), ...JSON.parse(raw) };
        if (!saved.pois || saved.pois.length === 0) {
          saved.pois = SEED_POIS.map(p => ({ ...p }));
        } else {
          // Merge in any new seed POIs that aren't already saved
          const existingIds = new Set(saved.pois.map(p => p.id));
          SEED_POIS.forEach(seed => {
            if (!existingIds.has(seed.id)) {
              saved.pois.push({ ...seed });
            }
          });
        }
        // Ensure new fields exist on older saved POIs
        saved.pois = saved.pois.map(p => ({
          category: 'sight',
          imageUrl: null,
          ...p
        }));
        return saved;
      }
    } catch (e) { /* ignore */ }
    const initial = defaultState();
    initial.pois = SEED_POIS.map(p => ({ ...p }));
    return initial;
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  // --- Wikipedia Image Fetching ---
  async function fetchWikipediaImage(name) {
    try {
      // Try direct page summary first
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
      const res = await fetch(summaryUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.thumbnail && data.thumbnail.source) {
          return data.thumbnail.source;
        }
      }
      // Fall back to search
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
          const title = searchData.query.search[0].title;
          const pageUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
          const pageRes = await fetch(pageUrl);
          if (pageRes.ok) {
            const pageData = await pageRes.json();
            if (pageData.thumbnail && pageData.thumbnail.source) {
              return pageData.thumbnail.source;
            }
          }
        }
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  async function autoFetchImage(poiId) {
    const poi = state.pois.find(p => p.id === poiId);
    if (!poi || poi.imageUrl) return;
    const url = await fetchWikipediaImage(poi.name);
    if (url) {
      poi.imageUrl = url;
      saveState();
      renderMapMarkers();
      renderListView();
    }
  }

  // --- Geocoding (Nominatim) ---
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
    const R = 6371;
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
      : [41.9028, 12.4964];

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

  function createMarkerIcon(poi) {
    if (poi.visited) {
      return L.divIcon({
        className: 'visited-marker-icon',
        html: '<div class="visited-marker-pin"><span class="visited-check">\u2713</span></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });
    }

    const color = categoryColor(poi.category);
    const emoji = categoryIcon(poi.category);
    return L.divIcon({
      className: 'category-marker-icon',
      html: `<div class="category-marker-pin" style="background:${color}"><span class="category-marker-emoji">${emoji}</span></div>`,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    });
  }

  function renderMapMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    if (baseMarker) {
      map.removeLayer(baseMarker);
      baseMarker = null;
    }

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

    state.pois.forEach(poi => {
      const markerIcon = createMarkerIcon(poi);
      const marker = L.marker([poi.lat, poi.lng], { icon: markerIcon }).addTo(map);

      const isVisited = poi.visited;
      const toggleLabel = isVisited ? 'Mark unvisited' : 'Mark visited';
      const cat = categoryIcon(poi.category);
      const imgHtml = poi.imageUrl
        ? `<div class="popup-image"><img src="${escapeHtml(poi.imageUrl)}" alt="" loading="lazy"></div>`
        : '';

      const popupHtml = `
        ${imgHtml}
        <div class="popup-title${isVisited ? ' popup-visited' : ''}">${cat} ${isVisited ? '\u2713 ' : ''}${escapeHtml(poi.name)}</div>
        ${poi.description ? `<div class="popup-desc">${escapeHtml(poi.description)}</div>` : ''}
        <div class="popup-actions">
          <a class="popup-link" href="${googleMapsUrl(poi.lat, poi.lng)}" target="_blank" rel="noopener">Open in Maps</a>
          <a class="popup-toggle-visited" href="#" data-poi-id="${poi.id}">${toggleLabel}</a>
          <a class="popup-edit" href="#" data-poi-id="${poi.id}">Edit</a>
        </div>
      `;
      marker.bindPopup(popupHtml, { maxWidth: 250 });
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

    const enriched = state.pois.map(poi => {
      const dist = haversineDistance(state.baseLocation.lat, state.baseLocation.lng, poi.lat, poi.lng);
      const bear = bearing(state.baseLocation.lat, state.baseLocation.lng, poi.lat, poi.lng);
      return { ...poi, distance: dist, bearing: bear, direction: cardinalDirection(bear) };
    });

    enriched.sort((a, b) => a.distance - b.distance);

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
        const cat = categoryIcon(poi.category);
        const imgHtml = poi.imageUrl
          ? `<div class="poi-card-image"><img src="${escapeHtml(poi.imageUrl)}" alt="" loading="lazy"></div>`
          : '';

        html += `
          <div class="poi-card${visitedClass}" data-poi-id="${poi.id}">
            ${imgHtml}
            <div class="poi-card-body">
              <div class="poi-card-header">
                <span class="poi-card-name">${cat} ${poi.visited ? '<span class="visited-badge">\u2713</span> ' : ''}${escapeHtml(poi.name)}</span>
                <span class="poi-card-distance">${formatDistance(poi.distance)}</span>
              </div>
              ${poi.description ? `<div class="poi-card-desc">${escapeHtml(poi.description)}</div>` : ''}
              <div class="poi-card-actions">
                <a class="poi-card-link" href="${googleMapsUrl(poi.lat, poi.lng)}" target="_blank" rel="noopener">Open in Maps</a>
                <button class="${visitedBtnClass}" data-toggle-id="${poi.id}">${visitedBtnLabel}</button>
                <button class="poi-card-edit" data-edit-id="${poi.id}">Edit</button>
              </div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('.poi-card-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditPoi(btn.dataset.editId);
      });
    });

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

  function setSelectedCategory(cat) {
    document.querySelectorAll('.category-option').forEach(el => {
      el.classList.toggle('category-option--active', el.dataset.category === cat);
    });
    document.getElementById('poi-category').value = cat;
  }

  function updateImagePreview(url) {
    const preview = document.getElementById('poi-image-preview');
    if (url) {
      preview.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview">`;
      preview.style.display = 'block';
    } else {
      preview.innerHTML = '';
      preview.style.display = 'none';
    }
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
    document.getElementById('poi-image-url').value = '';
    setSelectedCategory('sight');
    updateImagePreview(null);
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
    document.getElementById('poi-image-url').value = poi.imageUrl || '';
    setSelectedCategory(poi.category || 'sight');
    updateImagePreview(poi.imageUrl);
    openModal('poi-modal');
  }

  function savePoi() {
    const name = document.getElementById('poi-name').value.trim();
    const description = document.getElementById('poi-description').value.trim();
    const lat = parseFloat(document.getElementById('poi-lat').value);
    const lng = parseFloat(document.getElementById('poi-lng').value);
    const id = document.getElementById('poi-id').value;
    const visited = document.getElementById('poi-visited').checked;
    const category = document.getElementById('poi-category').value || 'sight';
    const imageUrl = document.getElementById('poi-image-url').value.trim() || null;

    if (!name) {
      alert('Please enter a name.');
      return;
    }
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please search for a location.');
      return;
    }

    if (id) {
      const idx = state.pois.findIndex(p => p.id === id);
      if (idx !== -1) {
        state.pois[idx] = { ...state.pois[idx], name, description, lat, lng, visited, category, imageUrl };
      }
    } else {
      const newId = generateId();
      state.pois.push({ id: newId, name, description, lat, lng, visited: false, category, imageUrl });
      // Auto-fetch Wikipedia image for new POIs without a manual URL
      if (!imageUrl) {
        setTimeout(() => autoFetchImage(newId), 100);
      }
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

  // --- Live Location Tracking ---
  function startLiveTracking() {
    if (!navigator.geolocation) return;
    if (watchId !== null) return; // Already tracking

    watchId = navigator.geolocation.watchPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        userLatLng = [lat, lng];

        if (!map) return;

        if (userLocationMarker) {
          userLocationMarker.setLatLng(userLatLng);
        } else {
          const icon = L.divIcon({
            className: 'live-location-icon',
            html: '<div class="live-location-pulse"></div><div class="live-location-dot"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          userLocationMarker = L.marker(userLatLng, {
            icon: icon,
            zIndexOffset: 1000
          }).addTo(map);
        }

        if (userAccuracyCircle) {
          userAccuracyCircle.setLatLng(userLatLng);
          userAccuracyCircle.setRadius(accuracy);
        } else {
          userAccuracyCircle = L.circle(userLatLng, {
            radius: accuracy,
            color: '#2979ff',
            fillColor: '#2979ff',
            fillOpacity: 0.08,
            weight: 1,
            opacity: 0.3
          }).addTo(map);
        }

        // Update locate button to show active state
        const btn = document.getElementById('btn-locate');
        if (btn) btn.classList.add('header-btn--tracking');
      },
      () => { /* silently ignore errors for continuous tracking */ },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  }

  function stopLiveTracking() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (userLocationMarker && map) {
      map.removeLayer(userLocationMarker);
      userLocationMarker = null;
    }
    if (userAccuracyCircle && map) {
      map.removeLayer(userAccuracyCircle);
      userAccuracyCircle = null;
    }
    userLatLng = null;
    const btn = document.getElementById('btn-locate');
    if (btn) btn.classList.remove('header-btn--tracking');
  }

  function panToUser() {
    if (userLatLng && map) {
      map.setView(userLatLng, Math.max(map.getZoom(), 15));
    } else if (!watchId) {
      startLiveTracking();
    } else {
      alert('Waiting for GPS signal...');
    }
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

    // Live location tracking
    startLiveTracking();

    // Locate me button
    document.getElementById('btn-locate').addEventListener('click', panToUser);

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

    // Settings: reset data
    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (!confirm('This will delete all your POIs and base location. Are you sure?')) return;
      localStorage.removeItem(STATE_KEY);
      location.reload();
    });

    // Add POI buttons
    document.getElementById('btn-add-poi').addEventListener('click', openAddPoi);
    document.getElementById('btn-add-poi-list').addEventListener('click', openAddPoi);

    // POI: category selector
    document.querySelectorAll('.category-option').forEach(el => {
      el.addEventListener('click', () => setSelectedCategory(el.dataset.category));
    });

    // POI: image URL change → preview
    document.getElementById('poi-image-url').addEventListener('input', (e) => {
      updateImagePreview(e.target.value.trim() || null);
    });

    // POI: fetch image from Wikipedia
    document.getElementById('btn-fetch-image').addEventListener('click', async () => {
      const name = document.getElementById('poi-name').value.trim();
      if (!name) { alert('Enter a name first.'); return; }
      const btn = document.getElementById('btn-fetch-image');
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const url = await fetchWikipediaImage(name);
        if (url) {
          document.getElementById('poi-image-url').value = url;
          updateImagePreview(url);
        } else {
          alert('No image found on Wikipedia for this name.');
        }
      } finally {
        btn.disabled = false;
        btn.textContent = 'Fetch';
      }
    });

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

    // Auto-fetch images for seed POIs that don't have images
    state.pois.forEach(poi => {
      if (!poi.imageUrl) {
        setTimeout(() => autoFetchImage(poi.id), Math.random() * 3000);
      }
    });

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
