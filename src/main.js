import { fetchPokemonList, fetchPokemonByNameOrId, fetchTypes } from "./api.js";
import {
  showLoader,
  hideLoader,
  showError,
  getFavorites,
  toggleFavorite,
} from "./utils.js";

const listContainer = document.getElementById("pokemonList");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const sortSelect = document.getElementById("sort");
let showingFavorites = false;
let allPokemonData = [];

async function loadTypes() {
  const data = await fetchTypes();
  data.results.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.name;
    option.textContent = t.name;
    typeFilter.appendChild(option);
  });
}

async function loadInitialPokemons() {
  try {
    showLoader();
    const data = await fetchPokemonList(20, 0);
    const detailed = await Promise.all(
      data.results.map((p) => fetchPokemonByNameOrId(p.name))
    );
    allPokemonData = detailed;
    renderPokemonCards(detailed);
  } catch (e) {
    showError(e.message);
  } finally {
    hideLoader();
  }
}

function getStarIcon(isFav) {
  return isFav
    ? new URL("./assets/icons/star-filled.svg", import.meta.url).href
    : new URL("./assets/icons/star-outline.svg", import.meta.url).href;
}

function renderPokemonCards(pokemons) {
  const noResults = document.getElementById("noResults");
  const favs = getFavorites();
  listContainer.innerHTML = "";

  if (pokemons.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  pokemons.forEach((p) => {
    const isFav = favs.includes(p.name);
    const card = document.createElement("div");
    card.className = "card";

    const starIcon = getStarIcon(isFav);

    card.innerHTML = `
      <img src="${p.sprites.front_default}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>#${p.id}</p>
      <button data-fav="${p.name}" class="fav-btn">
        <img src="${starIcon}" alt="Favorite Icon" class="fav-icon" />
      </button>
      <a href="detail.html?id=${p.id}">Ver más</a>
    `;

    listContainer.appendChild(card);
  });

  listContainer.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.fav;
      const nowFav = toggleFavorite(name);
      const icon = btn.querySelector("img");

      if (icon) {
        icon.src = getStarIcon(nowFav);
      }

      if (showingFavorites && !nowFav) {
        applyFilters();
      }
    });
  });
}

function applyFilters() {
  const noResults = document.getElementById("noResults");
  const resultCount = document.getElementById("resultCount");

  noResults?.classList.add("hidden");
  resultCount?.classList.add("hidden");

  let filtered = [...allPokemonData];

  const search = searchInput.value.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter((p) => p.name.includes(search));
  }

  const selectedType = typeFilter.value;
  if (selectedType) {
    filtered = filtered.filter((p) =>
      p.types.some((t) => t.type.name === selectedType)
    );
  }

  if (showingFavorites) {
    const favs = getFavorites();
    filtered = filtered.filter((p) => favs.includes(p.name));
  }

  const sortValue = sortSelect.value;
  filtered.sort((a, b) => {
    if (sortValue === "name") return a.name.localeCompare(b.name);
    return a.id - b.id;
  });

  if (resultCount && filtered.length > 0) {
    resultCount.textContent = `Se encontraron ${filtered.length} Pokémon.`;
    resultCount.classList.remove("hidden");
  }

  renderPokemonCards(filtered);
}

searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

const toggleFavBtn = document.getElementById("toggleFavorites");

toggleFavBtn.addEventListener("click", () => {
  showingFavorites = !showingFavorites;
  toggleFavBtn.classList.toggle("active", showingFavorites);
  toggleFavBtn.textContent = showingFavorites
    ? "🔁 Ver Todos"
    : "⭐ Ver Favoritos";
  applyFilters();
});

loadInitialPokemons();
loadTypes();

window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splashScreen");

  if (!sessionStorage.getItem("splashPlayed")) {
    setTimeout(() => {
      splash.style.display = "none";
      sessionStorage.setItem("splashPlayed", "true");
    }, 3500);
  } else {
    splash.style.display = "none";
  }
});
