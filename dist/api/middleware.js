import { config } from "../config.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, res, next) {
    config.fileserverHits++;
    next();
}
