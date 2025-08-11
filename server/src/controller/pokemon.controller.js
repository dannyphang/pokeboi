import { Router } from "express";
import express from "express";
import * as func from "../shared/function.js";
import * as API from "../shared/service.js";
import * as pokemon from "../service/pokemon.js";
const router = Router();

router.use(express.json());

// get all pokemon
router.get("/", async (req, res) => {
    try {
        pokemon
            .allPokemon()
            .then((url) => {
                res.status(200).json(
                    func.responseModel({
                        isSuccess: true,
                        responseMessage: "All Pokemon retrieved successfully",
                        data: url,
                    })
                );
            })
            .catch((error) => {
                console.error("Error retrieving all Pokemon:", error);
                API.createLog(error, req, res, 500, "pokemon");
                res.status(500).json(
                    func.responseModel({
                        isSuccess: false,
                        responseMessage: error,
                    })
                );
            });
    } catch (error) {
        console.log("error", error);
        API.createLog(error, req, res, 500, "pokemon");
        res.status(500).json(
            func.responseModel({
                isSuccess: false,
                responseMessage: error,
            })
        );
    }
});

export default router;
