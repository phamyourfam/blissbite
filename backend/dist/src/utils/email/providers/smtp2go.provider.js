"use strict";
/**
 * @fileoverview
 * SMTP2GO provider implementation adapter.
 * This module implements the adapter pattern to map between generic email interfaces
 * and SMTP2GO-specific API requests and responses.
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
exports.SMTP2GOProvider = void 0;
const _1 = require(".");
/**
 * SMTP2GO provider implementation
 * Implements the adapter pattern to convert between generic interfaces and SMTP2GO API
 */
class SMTP2GOProvider extends _1.BaseProvider {
    /**
     * Creates a new SMTP2GO provider
     * @param config - Email client configuration
     */
    constructor(config) {
        super(config);
        /** Base URL for SMTP2GO API */
        this.baseUrl = 'https://api.smtp2go.com/v3';
    }
    /**
     * Sends an email using SMTP2GO
     * @param options - Email options
     * @returns Promise resolving to the send response
     */
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Adapter pattern: Convert from generic EmailOptions to SMTP2GO specific format
            const payload = {
                api_key: this.apiKey,
                to: options.recipients.map((r) => r.name ? `${r.name} <${r.email}>` : r.email),
                sender: options.sender.name
                    ? `${options.sender.name} <${options.sender.email}>`
                    : options.sender.email,
                subject: options.subject,
                text_body: options.textBody,
                html_body: options.htmlBody
            };
            if (options.cc && options.cc.length > 0) {
                payload.cc = options.cc.map((r) => r.name ? `${r.name} <${r.email}>` : r.email);
            }
            if (options.bcc && options.bcc.length > 0) {
                payload.bcc = options.bcc.map((r) => r.name ? `${r.name} <${r.email}>` : r.email);
            }
            if (options.customHeaders) {
                payload.custom_headers = options.customHeaders;
            }
            if (options.attachments && options.attachments.length > 0) {
                payload.attachments = options.attachments.map((att) => ({
                    filename: att.filename,
                    fileblob: att.content,
                    mimetype: att.mimetype
                }));
            }
            if (options.templateId) {
                payload.template_id = options.templateId;
            }
            if (options.templateData) {
                payload.template_data = options.templateData;
            }
            if (options.tags && options.tags.length > 0) {
                payload.tag = options.tags[0]; // SMTP2GO only supports one tag
            }
            try {
                const smtp2goResponse = yield this.request('/email/send', payload);
                // Adapter pattern: Convert SMTP2GO specific response to generic EmailResponse
                return {
                    success: smtp2goResponse.data.succeeded > 0,
                    messageId: smtp2goResponse.data.email_id,
                    errors: smtp2goResponse.error_message
                        ? [smtp2goResponse.error_message]
                        : undefined,
                    rawResponse: smtp2goResponse
                };
            }
            catch (error) {
                return {
                    success: false,
                    errors: [error instanceof Error ? error.message : String(error)]
                };
            }
        });
    }
    /**
     * Gets email statistics from SMTP2GO
     * @param options - Statistics options
     * @returns Promise resolving to email statistics
     */
    getEmailStats(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                api_key: this.apiKey,
                start_date: options.startDate,
                end_date: options.endDate,
                per_page: options.pageSize,
                page: options.page
            };
            try {
                const smtp2goResponse = yield this.request('/stats/email_summary', payload);
                // Adapter pattern: Convert SMTP2GO specific stats to generic EmailStatsResponse
                return {
                    delivered: smtp2goResponse.data.emails.delivered,
                    opened: smtp2goResponse.data.emails.opened,
                    clicked: smtp2goResponse.data.emails.clicked,
                    bounced: smtp2goResponse.data.emails.failed,
                    rejected: 0, // SMTP2GO doesn't have this specific category
                    complained: smtp2goResponse.data.emails.complained,
                    unsubscribed: smtp2goResponse.data.emails.unsubscribed,
                    rawResponse: smtp2goResponse
                };
            }
            catch (error) {
                throw new Error(`Failed to get email stats: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Validates an email address using SMTP2GO
     * @param email - Email address to validate
     * @returns Promise resolving to boolean indicating validity
     */
    validateEmailAddress(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                api_key: this.apiKey,
                email: email
            };
            try {
                const response = yield this.request('/email/address/validate', payload);
                return response.data.result === 'valid';
            }
            catch (error) {
                this.logDebug('Email validation error:', error);
                return false;
            }
        });
    }
    /**
     * Gets remaining email credits (SMTP2GO specific)
     * @returns Promise resolving to number of available credits
     */
    getEmailCredits() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                api_key: this.apiKey
            };
            try {
                const response = yield this.request('/stats/email_credits', payload);
                return response.data.credits_available;
            }
            catch (error) {
                this.logDebug('Get credits error:', error);
                throw new Error(`Failed to get email credits: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Sends a request to the SMTP2GO API
     * @param endpoint - API endpoint path
     * @param data - Request data
     * @returns Promise resolving to the response
     * @private
     */
    request(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendRequest(`${this.baseUrl}${endpoint}`, data);
        });
    }
}
exports.SMTP2GOProvider = SMTP2GOProvider;
