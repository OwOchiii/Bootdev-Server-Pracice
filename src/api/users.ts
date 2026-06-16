import { Request, Response } from "express";
import {createUser, getUserByEmail} from "../db/queries/users.js";
import {BadRequestError, UnauthorizedError} from "../errors.js";
import {checkPasswordHash, hashPassword, makeJWT, makeRefreshToken} from "../auth.js";
import {config} from "../config.js";
import {createRefreshToken} from "../db/queries/token.js";

export async function handlerCreateUser(req: Request, res: Response) {
    const { email,password } = req.body;

    if (!email || typeof email !== "string") {
        throw new BadRequestError("Invalid email");
    }

    const user = await createUser({ email,hashed_password: await hashPassword(password) });

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

export async function handlerLogin(req: Request, res: Response) {
    let { email, password} = req.body;



    const login = await getUserByEmail(email);

    if (!login.email) {
        throw new UnauthorizedError("Invalid email or password");
    }

    if (!await checkPasswordHash(password, login.hashed_password)) {
        throw new UnauthorizedError("Invalid email or password");
    }

    let jwtToken = makeJWT(login.id, 3600, config.jwtSecret);

    let refreshToken = makeRefreshToken();

    createRefreshToken(refreshToken, login.id);

    return res.status(200).json({id: login.id, email: login.email, createdAt: login.createdAt, updatedAt: login.updatedAt,token: jwtToken,refreshToken: refreshToken})
}
