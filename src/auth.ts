import * as argon2 from 'argon2';
import jwt from "jsonwebtoken";
import {ForbiddenError, UnauthorizedError} from "./errors.js";
import { Request, Response } from "express"
import {randomBytes} from "node:crypto";

export function hashPassword(password: string) {
    return argon2.hash(password);
}

export function checkPasswordHash(password: string, hash: string) {
    return argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string{
    return jwt.sign({userID}, secret, {expiresIn});
}

export function validateJWT(tokenString: string, secret: string): string{
    try {
        let payload = jwt.verify(tokenString, secret) as jwt.JwtPayload;
        return payload.userID as string;
    }
    catch (err) {
        throw new UnauthorizedError("Invalid  (validateJWT)");
    }
}

export function getBearerToken(reg: Request) : string{
    let authHeader: string | undefined;
    if (reg !== undefined){
        authHeader = reg.get("Authorization");
    }

    if (!authHeader) {
        throw new UnauthorizedError("Token not found or invalid format");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new UnauthorizedError("Token not found");
    }
    return token;
}

export function getApiToken(reg: Request) : string{
    let authHeader: string | undefined;
    if (reg !== undefined){
        authHeader = reg.get("Authorization");
    }

    if (!authHeader) {
        throw new UnauthorizedError("Api Token not found or invalid format");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new UnauthorizedError("Token not found");
    }
    return token;
}


export function makeRefreshToken(): string{
    return randomBytes(256).toString("hex");
}