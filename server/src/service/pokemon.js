import * as Poke from "../configuration/pokemonConfig.js";
import { DEFAULT_OFFSET, DEFAULT_LIMIT } from "../shared/constant.js";
import axios from "axios";

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
            pokemon.type_relational = await Promise.all(
                pokemon.types.map((type) => {
                    return getTypeRelations(type.type.name);
                })
            );
            resolve(pokemon);
        } catch (error) {
            reject(error);
        }
    });
}

async function getAllVersions() {
    return new Promise(async (resolve, reject) => {
        try {
            Poke.pokedex
                .getVersionsList()
                .then(async (res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

async function getTypeRelations(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let relations = await Poke.pokedex.getTypeByName(id);
            resolve(relations);
        } catch (error) {
            reject(error);
        }
    });
}

async function getMoves(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let pokemon = await Poke.pokedex.getPokemonByName(id);
            let moves = await Promise.all(
                pokemon.moves.map(async (move) => {
                    let moveData = await Poke.pokedex.getMoveByName(move.move.name);
                    return moveData;
                })
            );
            resolve(moves);
        } catch (error) {
            reject(error);
        }
    });
}

async function getEvolutionChain(url) {
    try {
        const evo = await axios.get(url);
        const evolution = parseEvolutionChain(evo.data.chain);

        // resolve all async operations
        const pokeEvo = await Promise.all(
            evolution.map(async (evo) => {
                let pokemon = await pokemonById(evo.name);
                return {
                    pokemon,
                    min_level: evo.min_level ?? null,
                    trigger: evo.trigger ?? null,
                };
            })
        );

        return pokeEvo;
    } catch (error) {
        throw error;
    }
}

function parseEvolutionChain(chain) {
    const result = [];

    function traverse(node, fromDetail = null) {
        // push the current Pokémon
        result.push({
            name: node.species.name,
            min_level: fromDetail?.min_level ?? null,
            trigger: fromDetail?.trigger?.name ?? null,
        });

        // go deeper into evolutions
        node.evolves_to.forEach((evo) => {
            const detail = evo.evolution_details[0] || {};
            traverse(evo, detail);
        });
    }

    traverse(chain);
    return result;
}

function pokemonEncounterLocation(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let areas = await axios.get(url);
            resolve(areas.data);
        } catch (error) {
            reject(error);
        }
    });
}

export { allPokemon, getAllTypes, pokemonById, getAllVersions, getTypeRelations, getMoves, getEvolutionChain, pokemonEncounterLocation };
