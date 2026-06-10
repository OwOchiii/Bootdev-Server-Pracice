import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from "../errors.js";

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

export async function handlerReset(req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Access denied");
    }
    config.api.fileserverHits = 0;
    await deleteAllUsers();
    res.status(200);
    res.send("Hits reset to 0");
}

