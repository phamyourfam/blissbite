"use strict";
/**
 * @fileoverview
 * Base provider implementation with shared functionality.
 * This module provides common functionality that can be reused across providers.
 *
 * @author Your Name
 * @version 1.0.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
/**
 * Base provider class with shared functionality
 */
class BaseProvider {
    /**
     * Creates a new base provider
     * @param config - Email client configuration
     */
    constructor(config) {
        this.apiKey = config.apiKey;
        this.timeout = config.timeout || 30000;
        this.debug = config.debug || false;
    }
    /**
     * Sends a request to the API endpoint
     * @param url - Full URL to the API endpoint
     * @param data - Request body data
     * @param method - HTTP method (default: POST)
     * @returns Promise resolving to the response data
     * @throws Error if the request fails
     */
    sendRequest(url_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (url, data, method = 'POST') {
            this.logDebug('Request:', method, url, data);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            try {
                const response = yield fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                const result = yield response.json();
                this.logDebug('Response:', result);
                return result;
            }
            catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    throw new Error(`Request timeout after ${this.timeout}ms`);
                }
                throw error;
            }
            finally {
                clearTimeout(timeoutId);
            }
        });
    }
    /**
     * Logs debug information if debug mode is enabled
     * @param args - Arguments to log
     */
    logDebug(...args) {
        if (this.debug) {
            console.log('[EmailSDK]', ...args);
        }
    }
}
exports.BaseProvider = BaseProvider;
