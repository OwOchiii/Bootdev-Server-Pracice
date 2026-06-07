import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++;
    next();
}

export function middlewareErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on our end";
    
    res.status(statusCode).json({ error: message });
}
