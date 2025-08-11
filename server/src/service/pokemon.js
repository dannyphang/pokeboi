import * as Poke from "../configuration/pokemonConfig.js";
import { DEFAULT_OFFSET, DEFAULT_LIMIT } from "../shared/constant.js";

async function allPokemon() {
    return new Promise(async (resolve, reject) => {
        try {
            Poke.pokedex
                .getPokemonsList({
                    offset: DEFAULT_OFFSET,
                    limit: DEFAULT_LIMIT,
                })
                .then(async (res) => {
                    let pokeData = await Promise.all(
                        res.results.map(async (poke) => {
                            let pokemon = await Poke.pokedex.getPokemonByName(poke.name);
                            pokemon.species = await Poke.pokedex.getPokemonSpeciesByName(poke.name);
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

export { allPokemon };
