import { Request, Response } from "express";
import {createUser, getUserByEmail} from "../db/queries/users.js";
import {BadRequestError, UnauthorizedError} from "../errors.js";
import {checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken} from "../auth.js";
import {config} from "../config.js";
import {createRefreshToken, getRefreshToken, revokeRefreshToken} from "../db/queries/token.js";

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

    await createRefreshToken(refreshToken, login.id);

    return res.status(200).json({id: login.id, email: login.email, createdAt: login.createdAt, updatedAt: login.updatedAt,token: jwtToken,refreshToken: refreshToken})
}

export async function handlerRefreshToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    if (!token) {
        throw new UnauthorizedError("Token not found");
    }

    const refreshToken = await getRefreshToken(token);

    if (!refreshToken) {
        throw new UnauthorizedError("Invalid token");
    }

    if (refreshToken[0].revokedAt) {
        throw new UnauthorizedError("Token revoked");
    }

    if (refreshToken[0].expiresAt < new Date()) {
        throw new UnauthorizedError("Token expired");
    }

    let jwtToken = makeJWT(refreshToken[0].user_id, 3600, config.jwtSecret);

    return res.status(200).json({token: jwtToken});
}

export async function handlerRevokeToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    if (!token) {
        throw new UnauthorizedError("Token not found");
    }

    const refreshToken = await getRefreshToken(token);

    if (!refreshToken) {
        throw new UnauthorizedError("Invalid token");
    }

    await revokeRefreshToken(refreshToken[0].token);

    return res.status(204)


}