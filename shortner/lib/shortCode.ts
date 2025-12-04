const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export function generateCode(length = 6) {
    let out = "";
    for (let i = 0; i < length; i++) {
        out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return out;
}
