import express from "express";
import pokemonController from "./src/controller/pokemon.controller.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// app.use(express.json());

const port = 1201;

global.__basedir = __dirname;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// to resolve CORS issue
app.use(cors());

// increase file limit
app.use(express.json({ limit: 5000000000, type: "application/json" }));
app.use(
    express.urlencoded({
        limit: 5000000000,
        extended: true,
        parameterLimit: 5000000000000000,
        type: "application/json",
    })
);

app.use("/pokemon", pokemonController);

app.listen(port, () => {
    console.log(`server is running at port: ${port}... (${new Date()})`);
});
