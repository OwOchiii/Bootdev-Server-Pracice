import express from "express";
import { handlerReadiness } from "../api/readiness.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;
app.use("/app", express.static(path.join(__dirname, "../../")));
app.get("/healthz", handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
