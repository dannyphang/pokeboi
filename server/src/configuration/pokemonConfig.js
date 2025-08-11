import Pokedex from "pokedex-promise-v2";

const options = {
    cacheLimit: 100 * 1000, // 100s
    timeout: 5 * 1000, // 5s
};

const pokedex = new Pokedex(options);

export { pokedex };
