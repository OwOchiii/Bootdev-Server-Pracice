import * as argon2 from 'argon2';
import jwt from "jsonwebtoken";
import {ForbiddenError} from "./errors.js";


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
        return jwt.verify(tokenString, secret) as string;
    }
    catch (err) {
        throw new ForbiddenError("Invalid token");
    }

}