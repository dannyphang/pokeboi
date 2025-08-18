import { Router } from "express";
import express from "express";
import * as func from "../shared/function.js";
import * as API from "../shared/service.js";
import * as pokemon from "../service/pokemon.js";
const router = Router();

router.use(express.json());

// pokemon
router.get("/", async (req, res) => {
    try {
        pokemon
            .allPokemon({ offset: func.body(req).headers.offset, limit: func.body(req).headers.limit })
            .then((url) => {
                res.status(200).json(
                    func.responseModel({
                        isSuccess: true,
                        responseMessage: "All Pokemon retrieved successfully",
                        data: url,
                    })
                );
            })
            .catch(async (error) => {
                console.error("Error retrieving all Pokemon:", error);
                await API.createLog(error, req, res, 500, "pokemon");
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        await API.createLog(error, req, res, 500, "pokemon");
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// type
router.get("/type", async (req, res) => {
    try {
        const types = await pokemon.getAllTypes();
        res.status(200).json(
            func.responseModel({
                isSuccess: true,
                responseMessage: "All Pokemon types retrieved successfully",
                data: types,
            })
        );
    } catch (error) {
        console.error("Error retrieving Pokemon types:", error);
        await API.createLog(error, req, res, 500, "pokemon");
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// version
router.get("/version", async (req, res) => {
    try {
        pokemon
            .getAllVersions()
            .then((version) => {
                res.status(200).json(
                    func.responseModel({
                        isSuccess: true,
                        responseMessage: "Pokemon version retrieved successfully",
                        data: version,
                    })
                );
            })
            .catch(async (error) => {
                console.error("Error retrieving Pokemon version:", error);
                await API.createLog(error, req, res, 500, "pokemon");
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.error("Error retrieving Pokemon games:", error);
        await API.createLog(error, req, res, 500, "pokemon");
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// pokemon by id
router.get("/detail/:id", async (req, res) => {
    try {
        pokemon
            .pokemonById(req.params.id)
            .then((pokemon) => {
                res.status(200).json(
                    func.responseModel({
                        isSuccess: true,
                        responseMessage: "Pokemon retrieved successfully",
                        data: pokemon,
                    })
                );
            })
            .catch(async (error) => {
                console.error("Error retrieving Pokemon by ID:", error);
                await API.createLog(error, req, res, 500, "pokemon");
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.error("Error retrieving Pokemon by ID:", error);
        await API.createLog(error, req, res, 500, "pokemon");
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// move by pokemon id
router.get("/move/:id", async (req, res) => {
    try {
        pokemon
            .getMoves(req.params.id)
            .then((moves) => {
                res.status(200).json(
                    func.responseModel({
                        isSuccess: true,
                        responseMessage: "Pokemon moves retrieved successfully",
                        data: moves,
                    })
                );
            })
            .catch(async (error) => {
                console.error("Error retrieving Pokemon moves:", error);
                await API.createLog(error, req, res, 500, "pokemon");
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.error("Error retrieving Pokemon moves:", error);
        await API.createLog(error, req, res, 500, "pokemon");
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

// get evolution chain
router.get("/evolution", async (req, res) => {
    try {
        const evolutionChain = await pokemon.getEvolutionChain(func.body(req).headers.url);
        res.status(200).json(
            func.responseModel({
                isSuccess: true,
                responseMessage: "Pokemon evolution chain retrieved successfully",
                data: evolutionChain,
            })
        );
    } catch (error) {
        console.error("Error retrieving Pokemon evolution chain:", error);
        await API.createLog(error, req, res, 500, "pokemon");
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

export default router;
