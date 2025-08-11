import dotenv from "dotenv";
import assert from "assert";

dotenv.config();

const { environment_mode } = process.env;

export default {
    environment: environment_mode || "development",
};
