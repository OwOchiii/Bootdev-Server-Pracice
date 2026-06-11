import * as argon2 from 'argon2';


export function hashPassword(password: string) {
    return argon2.hash(password);
}

export function checkPasswordHash(password: string, hash: string) {
    return argon2.verify(hash, password);
}