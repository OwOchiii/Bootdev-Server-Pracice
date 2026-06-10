import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
        throw new BadRequestError("Invalid email");
    }

    const user = await createUser({ email });

    if (!user) {
        throw new BadRequestError("User already exists");
    }

    res.status(201).json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}
