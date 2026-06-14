import * as argon2 from 'argon2';
import jwt from "jsonwebtoken";


export function hashPassword(password: string) {
    return argon2.hash(password);
}

export function checkPasswordHash(password: string, hash: string) {
    return argon2.verify(hash, password);
}

function makeJWT(userID: string, expiresIn: number, secret: string): string{
    return jwt.sign({userID}, secret, {expiresIn});
}