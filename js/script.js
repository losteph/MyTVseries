// 1. STATO DELL'APP
let mySeriesDataset = [];
let currentFilter = 'all';
let currentLang = 'it';
let currentTheme = 'dark';
let searchQuery = ''; 
let currentSort = 'default';

// TRADUZIONI INTERFACCIA (Aggiornate con i 4 stati e la progressione)
const i18n = {
    it: {
        title: "📺 My Series", subtitle: "Archivio serie TV personale",
        all: "Tutte", watchlist: "Da Vedere", ongoing: "In Corso", watched: "Completate", stopped: "Interrotte",
        note: "Nota Personale", btnLang: "🌐 ENG",
        searchPlaceholder: "Cerca serie per titolo...", 
        sortDefault: "Ordine di Aggiunta", sortAlpha: "Alfabetico (A-Z)", sortAlphaDesc: "Alfabetico (Z-A)", sortDateDesc: "Più recenti (Anno)", sortDateAsc: "Più datati (Anno)",
        genresLabel: "Generi:", directorLabel: "Ideatore:", directorsLabel: "Ideatori:", castLabel: "Cast:",
        progSeasons: "Stagione:", progEpisodes: "Episodio:"
    },
    en: {
        title: "📺 My Series", subtitle: "Personal TV show archive",
        all: "All", watchlist: "Watchlist", ongoing: "Ongoing", watched: "Completed", stopped: "Stopped",
        note: "Personal Note", btnLang: "🌐 ITA",
        searchPlaceholder: "Search shows by title...", 
        sortDefault: "Date Added", sortAlpha: "Alphabetical (A-Z)", sortAlphaDesc: "Alphabetical (Z-A)", sortDateDesc: "Newest First (Year)", sortDateAsc: "Oldest First (Year)",
        genresLabel: "Genres:", directorLabel: "Creator:", directorsLabel: "Creators:", castLabel: "Cast:",
        progSeasons: "Season:", progEpisodes: "Episode:"
    }
};

// 2. INIZIALIZZAZIONE
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('data/series.json');
        mySeriesDataset = await response.json();
        updateUI();
        renderGrid();
    } catch (e) {
        console.error("Errore nel caricamento del JSON delle serie.", e);
        document.getElementById('seriesGrid').innerHTML = "<p style='color:red;'>Errore: Impossibile caricare series.json.</p>";
    }
});

// 3. CAMBIO LINGUA, TEMA, RICERCA E ORDINAMENTO
function toggleLang() {
    currentLang = currentLang === 'it' ? 'en' : 'it';
    updateUI();
    renderGrid();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('theme-btn').innerText = currentTheme === 'dark' ? "☀️" : "🌙";
}

function handleSearch(event) {
    searchQuery = event.target.value.toLowerCase();
    renderGrid();
}

function handleSort(event) {
    currentSort = event.target.value;
    renderGrid();
}

function updateUI() {
    const t = i18n[currentLang];
    document.getElementById('ui-title').innerText = t.title;
    document.getElementById('ui-subtitle').innerText = t.subtitle;
    document.getElementById('btn-all').innerText = t.all;
    document.getElementById('btn-watchlist').innerText = t.watchlist;
    document.getElementById('btn-ongoing').innerText = t.ongoing;
    document.getElementById('btn-watched').innerText = t.watched;
    document.getElementById('btn-stopped').innerText = t.stopped;
    document.getElementById('ui-note').innerText = t.note;
    document.getElementById('lang-btn').innerText = t.btnLang;
    
    document.getElementById('search-input').placeholder = t.searchPlaceholder;
    document.getElementById('opt-default').innerText = t.sortDefault;
    document.getElementById('opt-alpha').innerText = t.sortAlpha;
    document.getElementById('opt-alpha-desc').innerText = t.sortAlphaDesc;
    document.getElementById('opt-date-desc').innerText = t.sortDateDesc;
    document.getElementById('opt-date-asc').innerText = t.sortDateAsc;
}

function filterSeries(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${status}`).classList.add('active');
    renderGrid();
}

function getStarsHTML(rating) {
    if (!rating) return '';
    return '⭐'.repeat(rating);
}

// 4. RENDERING GRIGLIA PRINCIPALE
function renderGrid() {
    const grid = document.getElementById('seriesGrid');
    grid.innerHTML = '';
    const t = i18n[currentLang];

    let filtered = mySeriesDataset.map((s, i) => ({ ...s, originalIndex: i }));

    if (currentFilter !== 'all') {
        filtered = filtered.filter(s => s.status === currentFilter);
    }

    if (searchQuery.trim() !== '') {
        filtered = filtered.filter(s => {
            const displayTitle = s.title[currentLang] || s.title['it'];
            return displayTitle.toLowerCase().includes(searchQuery);
        });
    }

    if (currentSort === 'alpha') {
        filtered.sort((a, b) => (a.title[currentLang] || a.title['it']).localeCompare(b.title[currentLang] || b.title['it']));
    } else if (currentSort === 'alpha-desc') {
        filtered.sort((a, b) => (b.title[currentLang] || b.title['it']).localeCompare(a.title[currentLang] || a.title['it']));
    } else if (currentSort === 'date-desc') {
        filtered.sort((a, b) => b.year - a.year);
    } else if (currentSort === 'date-asc') {
        filtered.sort((a, b) => a.year - b.year);
    } else if (currentSort === 'default') {
        filtered.sort((a, b) => a.originalIndex - b.originalIndex);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 50px;">Nessuna serie trovata.</div>`;
        return;
    }

    filtered.forEach((serie) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => openModal(serie);

        // Traduzione dinamica del badge di stato
        let statusText = t.watchlist;
        if (serie.status === 'ongoing') statusText = t.ongoing;
        if (serie.status === 'watched') statusText = t.watched;
        if (serie.status === 'stopped') statusText = t.stopped;

        const displayTitle = serie.title[currentLang] || serie.title['it'];

        let posterHTML = serie.local_poster 
            ? `<img src="${serie.local_poster}" class="poster-img" alt="${displayTitle}" loading="lazy">`
            : `<div style="color: var(--text-muted); font-size: 12px; text-align: center; padding-top: 50%;">Nessuna copertina</div>`;

        card.innerHTML = `
            <div class="poster-wrapper">
                ${posterHTML}
                <span class="status-badge status-${serie.status}">${statusText}</span>
            </div>
            <div class="movie-info">
                <div>
                    <div class="movie-title">${displayTitle}</div>
                    <div class="movie-year">${serie.year}</div>
                </div>
                <div class="stars">${getStarsHTML(serie.rating)}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 5. GESTIONE MODALE DETTAGLI (Con Barra di Avanzamento)
function openModal(serie) {
    const t = i18n[currentLang];
    const displayTitle = serie.title[currentLang] || serie.title['it'];
    const displayComment = (serie.comment && serie.comment[currentLang]) ? serie.comment[currentLang] : (serie.comment ? serie.comment['it'] : '');

    document.getElementById('seriesModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = displayTitle;
    document.getElementById('modalYear').innerText = `(${serie.year})`;
    document.getElementById('modalRating').innerText = getStarsHTML(serie.rating);
    
    const modalPoster = document.getElementById('modalPoster');
    modalPoster.src = serie.local_poster || '';
    modalPoster.style.display = serie.local_poster ? 'block' : 'none';

    // Gestione Nota Personale (se vuota "" o null, nasconde il box)
    if (displayComment && displayComment.trim() !== "") {
        document.getElementById('modalCommentContainer').style.display = 'block';
        document.getElementById('modalComment').innerText = displayComment;
    } else {
        document.getElementById('modalCommentContainer').style.display = 'none';
    }

    // 6. LOGICA MULTI-BARRA DI PROGRESSIONE PER OGNI STAGIONE
    const progressContainer = document.getElementById('modalProgressContainer');
    progressContainer.innerHTML = ''; // Pulisce le barre del film precedentemente aperto

    if (serie.progress && Array.isArray(serie.progress) && serie.progress.length > 0) {
        progressContainer.style.display = 'block';

        serie.progress.forEach(seasonData => {
            const currentEp = seasonData.watched_episodes || 0;
            const totalEp = seasonData.total_episodes || 1;
            const percentage = Math.min((currentEp / totalEp) * 100, 100);

            // Determina il colore della barra della singola stagione in base al suo completamento
            let barColor = 'var(--accent)'; // Azzurro di default (Ongoing)
            if (percentage === 100) {
                barColor = 'var(--seen-color)'; // Verde se completata al 100%
            } else if (serie.status === 'stopped') {
                barColor = '#ef4444'; // Rossa se la serie è interrotta
            } else if (currentEp === 0) {
                barColor = 'var(--border-color)'; // Grigio spento se non ancora iniziata
            }

            // Genera l'HTML per la singola stagione
            const seasonBox = document.createElement('div');
            seasonBox.className = 'season-progress-box';
            seasonBox.innerHTML = `
                <div class="progress-text-row">
                    <span>${t.progSeasons} <strong>${seasonData.season}</strong></span>
                    <span>${t.progEpisodes} <strong>${currentEp}/${totalEp}</strong></span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${barColor};"></div>
                </div>
            `;
            progressContainer.appendChild(seasonBox);
        });
    } else {
        progressContainer.style.display = 'none';
    }

    // TAG DINAMICI (Generi, Ideatore, Cast) con allineamento protetto
    const rowGenres = document.getElementById('row-genres');
    rowGenres.innerHTML = '';
    if (serie.genres && Array.isArray(serie.genres) && serie.genres.length > 0) {
        rowGenres.style.display = 'flex';
        rowGenres.innerHTML = `<strong>${t.genresLabel}</strong>`;
        serie.genres.forEach(g => rowGenres.innerHTML += `<span class="tag">${g}</span>`);
    } else { rowGenres.style.display = 'none'; }

    const rowDirector = document.getElementById('row-director');
    rowDirector.innerHTML = '';
    if (serie.director && serie.director.trim() !== "") {
        rowDirector.style.display = 'flex';
        const labelText = serie.director.includes(',') ? t.directorsLabel : t.directorLabel;
        rowDirector.innerHTML = `<strong>${labelText}</strong><span class="tag" style="background-color: var(--accent); color: #fff;">🎬 ${serie.director}</span>`;
    } else { rowDirector.style.display = 'none'; }
    
    const rowCast = document.getElementById('row-cast');
    rowCast.innerHTML = '';
    if (serie.cast && Array.isArray(serie.cast) && serie.cast.length > 0) {
        rowCast.style.display = 'flex';
        rowCast.innerHTML = `<strong>${t.castLabel}</strong>`;
        serie.cast.forEach(actor => rowCast.innerHTML += `<span class="tag" style="background-color: #475569; color: #fff;">🎭 ${actor}</span>`);
    } else { rowCast.style.display = 'none'; }
}

function closeModal(event) {
    if (event.target.id === 'seriesModal' || event.target.className === 'close-btn') {
        document.getElementById('seriesModal').style.display = 'none';
    }
}