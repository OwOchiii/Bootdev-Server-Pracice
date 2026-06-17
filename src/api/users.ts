import { Request, Response } from "express";
import {createUser, getUserByEmail, getUserById, updateUser, upgradeChripsById} from "../db/queries/users.js";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../errors.js";
import {checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT} from "../auth.js";
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
        isChirpyRed: user.is_chirpy_red
    });
}

export async function handlerLogin(req: Request, res: Response) {
    let {email,password} = req.body;



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

    return res.status(200).json({id: login.id, email: login.email, createdAt: login.createdAt, updatedAt: login.updatedAt,token: jwtToken,refreshToken: refreshToken,isChirpyRed: login.is_chirpy_red})
}

export async function handlerRefreshToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    if (!token) {
        throw new UnauthorizedError("Token not found");
    }

    const refreshToken = await getRefreshToken(token);

    // FIX 1: Safely check if refreshToken is null, undefined, or an empty array
    if (!refreshToken || !Array.isArray(refreshToken) || refreshToken.length === 0) {
        throw new UnauthorizedError("Invalid token");
    }

    // FIX 2: Use Optional Chaining (?.) just to be absolutely bulletproof
    const tokenData = refreshToken[0];

    if (tokenData?.revokedAt) {
        throw new UnauthorizedError("Token revoked");
    }

    // Ensure expiresAt exists before comparing
    if (!tokenData?.expiresAt || tokenData.expiresAt < new Date()) {
        throw new UnauthorizedError("Token expired");
    }

    let jwtToken = makeJWT(tokenData.user_id, 3600, config.jwtSecret);

    return res.status(200).json({ token: jwtToken });
}

export async function handlerRevokeToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    if (!token) {
        throw new UnauthorizedError("Token not found");
    }

    const refreshToken = await getRefreshToken(token);

    if (!refreshToken) {
        throw new UnauthorizedError("Invalid token(handlerRevokeToken)");
    }

    await revokeRefreshToken(refreshToken[0].token);

    return res.status(204).send()

}

export async function handlerUpdateUser(req: Request, res: Response) {
    const token = getBearerToken(req);

    const userId = validateJWT(token, config.jwtSecret);

    if (!token) {
        throw new UnauthorizedError("Token not found");
    }

    const {email, password} = req.body;

    let hashedPassword = await hashPassword(password);
    await updateUser(email, hashedPassword, userId);
    const updatedUser = await getUserByEmail(email);

    return res.status(200).json({id: updatedUser.id, email: updatedUser.email, createdAt: updatedUser.createdAt, updatedAt: updatedUser.updatedAt});
}

export async function handlerUpgradeUser(req: Request, res: Response) {

    const {event, data} = req.body;

    if (event != "user.upgraded"){
        res.status(204).send();
        return;
    }

    if (event === "user.upgraded"){
        if (await getUserById(data.body.userId) == undefined){
            throw new NotFoundError("User not found");
        }
        await upgradeChripsById(data.body.userId);
        res.status(204).send();
    }
}