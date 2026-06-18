import { Request, Response } from "express";
import {BadRequestError, ForbiddenError, NotFoundError} from "../errors.js";
import {
    createChirp,
    deleteChirpById, getAllChirpOrderByCreatedAtAsc,
    getAllChirpOrderByCreatedAtDesc,
    getAllChirps,
    getChirpById,
    getChirpsByUserId
} from "../db/queries/chirps.js";
import {getBearerToken, validateJWT} from "../auth.js";
import {config} from "../config.js";

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
    const { body} = req.body;

    let token = getBearerToken(req);
    const userId = validateJWT(token, config.jwtSecret);

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
    const {sort} = req.query

    if (sort === "desc")
    {
        const chirps = await getAllChirpOrderByCreatedAtDesc();
        res.status(200).json(chirps);
        return;
    }

    const chirps = await getAllChirpOrderByCreatedAtAsc();
    res.status(200).json(chirps);
}

export async function handlerGetChirpById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        throw new BadRequestError("Invalid ID");
    }

    const chirp = await getChirpById(id);
    if (chirp ==undefined) throw new NotFoundError("Chirp not found");
    res.status(200).json(chirp);
}

    export async function handlerDeleteChirpById(req: Request, res: Response) {
        const { id } = req.params;
        if (typeof id !== "string") {
            throw new BadRequestError("Invalid ID");
        }
        const userId = validateJWT(getBearerToken(req), config.jwtSecret);


        if (await getChirpById(id) === null) throw new BadRequestError("Chirp not found")

        if (userId !== (await getChirpById(id)).userId) {
            throw new ForbiddenError("You are not authorized to delete this chirp");
        }

        await deleteChirpById(id);

        res.status(204).send();
    }

