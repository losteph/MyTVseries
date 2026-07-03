# 📺 MySeries

Un'applicazione web leggera, indipendente e bilingue (Italiano/Inglese) progettata per tracciare la progressione delle proprie **Serie TV** preferite. Sviluppata in puro codice web statico (HTML, CSS e JavaScript), l'applicazione funziona interamente lato client leggendo un database locale in formato JSON.

Questo progetto nasce come derivato ottimizzato di **MyMovies**, adattando il layout per mostrare lo stato di avanzamento di stagioni ed episodi al posto della trama.

---

## ✨ Funzionalità Principali

*   **Tracciamento Avanzamento:** Una barra di progressione visiva si riempie in tempo reale calcolando la percentuale matematica degli episodi visti rispetto al totale della serie.
*   **4 Stati di Visione Personalizzati:**
    *   `Da Vedere (Watchlist)`: Serie salvate per il futuro.
    *   `In Corso (Ongoing)`: Serie che stai guardando attualmente (barra azzurra).
    *   `Completate (Watched)`: Serie finite del tutto (barra verde).
    *   `Interrotte (Stopped)`: Serie interrotte dopo pochi episodi (barra rossa).
*   **Interfaccia Dinamica ed Ergonomica:** Layout modale avanzato con locandina fissa a sinistra e dettagli scorrevoli a destra su PC, ottimizzato per il responsive su smartphone.
*   **Filtri e Ordinamento Completi:** Cerca in tempo reale per titolo e ordina la tua collezione per ordine di aggiunta, alfabetico o per anno di uscita.
*   **Bilingue e Dual-Theme:** Supporto completo per lingua Italiana/Inglese e switch istantaneo tra Tema Chiaro e Tema Scuro.

---

## 📂 Struttura del Progetto

```text
MySeries/
├── index.html          # Struttura e scheletro dell'applicazione web
├── css/
│   ├── style.css       # Stili principali e layout avanzato per PC
│   └── mobile.css      # Ottimizzazioni responsive per smartphone
├── js/
│   └── script.js       # Logica dell'app, calcolo avanzamento e traduzioni
├── data/
│   └── series.json     # Il database locale contenente la tua collezione
└── img/
    └── ...             # Le copertine delle serie tv (.jpg)
```

## 📊 Struttura del Database e Stati (`series.json`)

Il file `series.json` memorizza i metadati e la progressione di ogni serie. Grazie al supporto multi-stagione, l'applicazione genererà automaticamente una barra di avanzamento per ogni blocco inserito nell'array (`progress`).

---

Di seguito viene mostrato un esempio reale con due serie in stati differenti: **The Boys** (in corso di visione con l'ultima stagione incompleta) e **Stranger Things** (ancora da iniziare).

```json
[
  {
    "title": { "it": "The Boys", "en": "The Boys" },
    "year": 2019,
    "status": "ongoing",
    "rating": 4,
    "local_poster": "img/the_boys.jpg",
    "director": "Eric Kripke",
    "genres": ["Action", "Sci-Fi"],
    "cast": ["Karl Urban", "Jack Quaid"],
    "comment": { "it": "In pari con l'ultima stagione.", "en": "Caught up with the latest season." },
    "progress": [
      { "season": 1, "watched_episodes": 8, "total_episodes": 8 },
      { "season": 2, "watched_episodes": 8, "total_episodes": 8 },
      { "season": 3, "watched_episodes": 8, "total_episodes": 8 },
      { "season": 4, "watched_episodes": 3, "total_episodes": 8 }
    ]
  },
  {
    "title": { "it": "Stranger Things", "en": "Stranger Things" },
    "year": 2016,
    "status": "watchlist",
    "rating": null,
    "local_poster": "img/stranger_things.jpg",
    "director": "The Duffer Brothers",
    "genres": ["Sci-Fi", "Drama"],
    "cast": ["Millie Bobby Brown", "Winona Ryder"],
    "comment": { "it": "", "en": "" },
    "progress": [
      { "season": 1, "watched_episodes": 0, "total_episodes": 8 },
      { "season": 2, "watched_episodes": 0, "total_episodes": 9 },
      { "season": 3, "watched_episodes": 0, "total_episodes": 8 },
      { "season": 4, "watched_episodes": 0, "total_episodes": 9 }
    ]
  }
]
```

Il campo "status" accetta 4 valori specifici scritti in minuscolo. Ognuno colorerà il badge sulla copertina e cambierà la logica visiva delle barre di progresso:

- `watchlist` (Da Vedere): La serie è salvata nel tuo archivio ma non hai ancora guardato nessun episodio. Le barre di progressione all'interno del modale rimarranno grigie e spente.

- `ongoing` (In Corso): Stai guardando attivamente la serie. Le stagioni completate diventeranno verdi, mentre la stagione che stai guardando mostrerà una barra azzurra parziale.

- `watched` (Completate): Hai finito di vedere la serie (tutti gli episodi di tutte le stagioni). Tutte le barre all'interno del modale diventeranno automaticamente verdi stabili.

- `stopped` (Interrotte): La serie non ti è piaciuta o hai deciso di mollarla a metà (es. dopo 2 episodi). In questo stato, la barra della stagione interrotta si colorerà di rosso, indicando visivamente il blocco del tracciamento.