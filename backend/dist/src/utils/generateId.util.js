"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateId;
const uuid = require('uuid');
function generateId() {
    return uuid();
}
