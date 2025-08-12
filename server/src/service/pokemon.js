import * as Poke from "../configuration/pokemonConfig.js";
import { DEFAULT_OFFSET, DEFAULT_LIMIT } from "../shared/constant.js";

async function allPokemon({ offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT }) {
    return new Promise(async (resolve, reject) => {
        try {
            Poke.pokedex
                .getPokemonsList({
                    offset: offset ?? DEFAULT_OFFSET,
                    limit: limit ?? DEFAULT_LIMIT,
                })
                .then(async (res) => {
                    let pokeData = await Promise.all(
                        res.results.map(async (poke) => {
                            let pokemon = await Poke.pokedex.getPokemonByName(poke.name);
                            pokemon.species = await Poke.pokedex.getPokemonSpeciesByName(pokemon.id);
                            return pokemon;
                        })
                    );
                    let pokeList = {
                        count: pokeData.length,
                        next: res.next,
                        previous: res.previous,
                        results: pokeData,
                    };
                    resolve(pokeList);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

async function getAllTypes() {
    return new Promise(async (resolve, reject) => {
        try {
            Poke.pokedex
                .getTypesList()
                .then(async (res) => {
                    let pokeData = await Promise.all(
                        res.results.map(async (poke) => {
                            let pokemon = await Poke.pokedex.getTypeByName(poke.name);
                            return pokemon;
                        })
                    );

                    resolve(pokeData);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

async function pokemonById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let pokemon = await Poke.pokedex.getPokemonByName(id);
            pokemon.species = await Poke.pokedex.getPokemonSpeciesByName(pokemon.id);
            resolve(pokemon);
        } catch (error) {
            reject(error);
        }
    });
}

export { allPokemon, getAllTypes, pokemonById };
