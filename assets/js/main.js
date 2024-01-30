const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

const pokeApi = {};

class Pokemon {
  constructor(
    id,
    name,
    types,
    type,
    hp,
    attack,
    special,
    speed,
    defense,
    image
  ) {
    this.id = id;
    this.name = name;
    this.types = types;
    this.type = type;
    this.hp = hp;
    this.attack = attack;
    this.special = special;
    this.speed = speed;
    this.defense = defense;
    this.image = image;
  }
}

pokeApi.getPokemon = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(url)
    .then((response) => response.json())
    .then((bodyJson) => bodyJson.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};

pokeApi.getPokemonDetails = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then((pokemon) => pokeApi.createPokemon(pokemon));
};

pokeApi.createPokemon = (animal) => {
  const types = animal.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  // pokemon.types = types
  // pokemon.type = type
  return new Pokemon(
    animal.id,
    animal.name,
    types
    ,
    type,
    animal["stats"][0]["base_stat"],
    animal["stats"][1]["base_stat"],
    animal["stats"][3]["base_stat"],
    animal["stats"][5]["base_stat"],
    animal["stats"][2]["base_stat"],
    animal["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
      "front_default"
    ]
  );
};

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.id}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.image}"
                     alt="${pokemon.name}">
            </div>
            

             
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemon(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
