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
    config.api.fileserverHits++;
    next;
}
export function middlewareErrorHandler(err, req, res, next) {
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? "Something went wrong on our end" : err.message;
    res.status(statusCode).json({ error: message });
}
