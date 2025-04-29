"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Scrypt {
    /**
     * Constructs a new Scrypt instance.
     * Generates a random salt and derives a hash from the provided key.
     *
     * @param key - The plain text key (or password) to hash.
     * @throws {Error} Will throw an error if key hashing fails.
     */
    constructor(key) {
        // Generate a random salt (16 bytes, in hex)
        this.salt = crypto_1.default.randomBytes(16).toString('hex');
        try {
            // Derive a 64-byte key from the provided key using the generated salt.
            const derivedKey = crypto_1.default.scryptSync(key, this.salt, 64);
            this.hash = derivedKey.toString('hex');
        }
        catch (error) {
            // Rethrow the error with additional context.
            throw new Error(`Error hashing the key: ${error.message}`);
        }
    }
    /**
     * A getter that returns the combined salt and hash in the format "salt:hash".
     */
    get combined() {
        return `${this.salt}:${this.hash}`;
    }
    /**
     * Compares a plain text key to a given hash using the provided salt.
     * Uses crypto.timingSafeEqual to prevent timing attacks.
     *
     * @param key - The plain text key (or password) to verify.
     * @param salt - The salt that was used to generate the original hash.
     * @param hash - The hash to compare against.
     * @returns {boolean} True if the derived key matches the hash; false otherwise.
     */
    static compare(key, salt, hash) {
        try {
            // Derive a key from the input key using the provided salt.
            const keyBuffer = crypto_1.default.scryptSync(key, salt, 64);
            const hashBuffer = Buffer.from(hash, 'hex');
            // It is important that both buffers have the same length before comparing.
            if (keyBuffer.length !== hashBuffer.length) {
                return false;
            }
            // timingSafeEqual ensures that the comparison is resistant to timing attacks.
            return crypto_1.default.timingSafeEqual(keyBuffer, hashBuffer);
        }
        catch (error) {
            // If any error occurs (e.g., invalid parameters), return false.
            return false;
        }
    }
}
exports.Scrypt = Scrypt;
