import { Request, Response } from "express";

export function handlerValidateChirp(req: Request, res: Response) {
    const { body } = req.body;

    if (!body || typeof body !== "string") {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    if (body.length > 140) {
        throw new Error("Chirp is too long");
    }

    res.status(200).json({ cleanedBody: filterFunction(body), valid: true });
}

export function filterFunction(str: string): string {
    let array = str.split(/\s+/);
    for (let i = 0; i < array.length; i++) {
        if (array[i].toLowerCase() === "kerfuffle" || array[i].toLowerCase() === "sharbert" || array[i].toLowerCase() === "fornax") {
            array[i] = "****";
        }
    }
    return array.join(" ");
}