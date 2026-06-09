import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerMetrics(req: Request, res: Response) {
    res.header("Content-Type", "text/html; charset=utf-8");
    res.status(200);
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

export function handlerReset(req: Request, res: Response) {
    config.api.fileserverHits = 0;
    res.status(200);
    res.send("Hits reset to 0");
}
