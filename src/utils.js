export function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

export function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

export function showError(msg) {
  const err = document.getElementById("error");
  err.textContent = msg;
  err.classList.remove("hidden");
}

const FAVORITES_KEY = "pokedex_favorites";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function toggleFavorite(name) {
  const favs = getFavorites();
  const exists = favs.includes(name);
  const updated = exists ? favs.filter((n) => n !== name) : [...favs, name];
  saveFavorites(updated);
  return !exists; // true si lo agregamos, false si lo quitamos
}

export function isFavorite(name) {
  return getFavorites().includes(name);
}
