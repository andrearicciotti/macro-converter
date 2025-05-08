// recupero input e contenitore dei risultati
const searchInput = document.querySelector(".ms-search-input");
const searchButton = document.querySelector(".ms-search-button");
const resultsContainer = document.querySelector(".ms-results-container");

// array con percorso relativo dei prodotti di test presenti localmente
const products = [
  "data/pestoConad.json",
  "data/pestoEurospin.json",
  "data/pestoLidl.json",
];

// al click sul button di ricerca aggiungo funzione di ricerca asincrona
searchButton.addEventListener("click", async (event) => {
  event.preventDefault();

  // recupero il valore dell' input e inserisco un testo nel contenitore dei risultati in attesa degli stessi
  const query = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = "Ricerca in corso...";

  const url = `https://it.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&lc=it&country=italy&page_size=10`;

  // per ogni prodotto nell' array di prodotti di test locali
  for (const product of products) {
    try {
      const res = await fetch(url);
      const data = await res.json();
    
      if (data.products && data.products.length > 0) {
        resultsContainer.innerHTML = data.products
        .map(
          (p) =>
            `<div class="card mb-2 d-flex flex-row ms-card">
              <div class="ms-card-img-container">
                <img class="ms-card-img" src="${p.selected_images.front.small.fr}">
              </div>
              <div class="ms-card-body">
                  <h5 class="card-title">${p.product_name} (100g)</h5>
                  <p class="card-text">Marca: ${p.brands}</p>
                  <p class="card-text">Energia: ${p.nutriments["energy-kcal_100g"]} kcal</p>
                  <p class="card-text">Carboidrati: ${p.nutriments["carbohydrates_100g"]} g</p>
                  <p class="card-text">Proteine: ${p.nutriments["proteins_100g"]} g</p>
                  <p class="card-text">Grassi: ${p.nutriments["fat_100g"]} g</p>
              </div>
              </div>`
        )
        .join("");
      } else {
        resultsContainer.innerHTML = "Nessun prodotto trovato.";
      }
    } catch (error) {
      console.error(`Errore nel recuperare il prodotto ${product}: `, error);
    }
  }
});
