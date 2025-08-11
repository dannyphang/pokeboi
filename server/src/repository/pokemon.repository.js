import * as Poke from "../configuration/pokemonConfig.js";

function findAll() {
    return new Promise((resolve, reject) => {
        Poke.pokedex
            .getPokemonsList()
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export { findAll };
