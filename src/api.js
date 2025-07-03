export async function fetchPokemonList(limit = 20, offset = 0) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Error al obtener la lista de Pokémon");
  return res.json();
}

export async function fetchPokemonByNameOrId(name) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) throw new Error("No se encontró el Pokémon");
  return res.json();
}

export async function fetchTypes() {
  const res = await fetch("https://pokeapi.co/api/v2/type");
  if (!res.ok) throw new Error("Error al obtener tipos");
  return res.json();
}
