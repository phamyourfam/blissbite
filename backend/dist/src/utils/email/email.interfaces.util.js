"use strict";
/**
 * @fileoverview
 * Core interfaces and abstract classes for the Email Provider SDK.
 * This module defines the contracts that all email providers must implement.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailClientFactory = void 0;
/**
 * Abstract factory for creating email providers
 * Implementing the Abstract Factory pattern
 */
class EmailClientFactory {
    /**
     * Creates a new email client factory
     * @param config - Configuration for the email provider
     */
    constructor(config) {
        this.config = config;
    }
}
exports.EmailClientFactory = EmailClientFactory;
