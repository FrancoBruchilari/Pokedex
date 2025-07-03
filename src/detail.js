import { fetchPokemonByNameOrId } from "./api.js";
import { showLoader, hideLoader, showError } from "./utils.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("detailContainer");

// 🔧 Utilidad para construir la URL de los íconos SVG de tipo
// Desde /src/detail.js accedemos a /src/assets/...
function getTypeIcon(typeName) {
  return new URL(`./assets/type-icons/${typeName}.svg`, import.meta.url).href;
}

function getStatIcon(statName) {
  const cleanName = statName.toLowerCase().replace(" ", "-");
  return new URL(`./assets/stat-icons/${cleanName}.png`, import.meta.url).href;
}

async function loadDetails() {
  try {
    showLoader();

    const data = await fetchPokemonByNameOrId(id);
    const name = data.name;
    const image =
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default;
    const types = data.types.map((t) => t.type.name);
    const height = data.height;
    const weight = data.weight;
    const stats = data.stats;

    const typeHTML = types
      .map((type) => {
        const color = typeColors[type] || "#ccc";
        const icon = getTypeIcon(type);
        return `
          <div class="pokemon-type" style="background:${color}; border-color:${color}">
            <img src="${icon}" alt="${type} icon" />
            <span>${type.toUpperCase()}</span>
          </div>
        `;
      })
      .join("");

    const statsHTML = stats
      .map((stat) => {
        const icon = getStatIcon(stat.stat.name);
        return `
          <li class="stat-item">
            <img src="${icon}" alt="${stat.stat.name} icon" />
            ${stat.stat.name.toUpperCase()}: ${stat.base_stat}
          </li>
        `;
      })
      .join("");

    container.innerHTML = `
      <img src="${image}" alt="${name}" />
      <h2>${name.toUpperCase()} (#${data.id})</h2>
      <div class="pokemon-types">${typeHTML}</div>
      <p>Peso: ${weight} | Altura: ${height}</p>
      <p>Estadísticas:</p>
      <ul class="stat-list">${statsHTML}</ul>
    `;
  } catch (e) {
    showError(e.message);
  } finally {
    hideLoader();
  }
}

const typeColors = {
  fire: "#ef5350",
  water: "#42a5f5",
  grass: "#66bb6a",
  electric: "#ffeb3b",
  poison: "#ab47bc",
  flying: "#90caf9",
  bug: "#9ccc65",
  normal: "#e0e0e0",
  ground: "#d4a373",
  rock: "#a1887f",
  ghost: "#7e57c2",
  dark: "#616161",
  steel: "#b0bec5",
  fairy: "#f48fb1",
  psychic: "#f06292",
  dragon: "#9575cd",
  fighting: "#ef9a9a",
  ice: "#81d4fa",
};

loadDetails();
