"use strict";
/**
 * @file smtp2go.factory.ts
 * @fileoverview
 * SMTP2GO Factory implementation.
 * This module implements the abstract factory pattern for creating SMTP2GO providers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTP2GOClientFactory = void 0;
const __1 = require("..");
const providers_1 = require("../providers");
/**
 * Factory for creating SMTP2GO providers
 * Implements the Abstract Factory pattern
 */
class SMTP2GOClientFactory extends __1.EmailClientFactory {
    /**
     * Creates a new SMTP2GO provider
     * @returns SMTP2GO provider instance
     */
    createEmailProvider() {
        return new providers_1.SMTP2GOProvider(this.config);
    }
}
exports.SMTP2GOClientFactory = SMTP2GOClientFactory;
