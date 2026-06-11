import { Request, Response } from "express";
import { BadRequestError } from "../errors.js";
import {createChirp, getAllChirps, getChirpById} from "../db/queries/chirps.js";

function cleanText(text: string): string {
    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    const array = text.split(/\s+/);
    
    for (let i = 0; i < array.length; i++) {
        const cleanWord = array[i].replace(/[^a-zA-Z]/g, "").toLowerCase();
        if (profaneWords.includes(cleanWord)) {
            array[i] = "****";
        }
    }
    
    return array.join(" ");
}

export async function handlerCreateChirp(req: Request, res: Response) {
    const { body, userId } = req.body;

    if (!body || typeof body !== "string") {
        throw new BadRequestError("Invalid request body");
    }

    if (!userId || typeof userId !== "string") {
        throw new BadRequestError("Invalid user ID");
    }

    if (body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const cleanedBody = cleanText(body);
    
    const chirp = await createChirp({
        body: cleanedBody,
        userId,
    });

    res.status(201).json({
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.userId,
    });
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const chirps = await getAllChirps();
    res.status(200).json(chirps);
}

export async function handlerGetChirpById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        throw new BadRequestError("Invalid ID");
    }

    const chirp = await getChirpById(id);
    res.status(200).json(chirp);
}