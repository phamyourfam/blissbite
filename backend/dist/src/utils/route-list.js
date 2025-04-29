"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printRoutes = printRoutes;
const route_list_1 = __importDefault(require("route-list"));
const server_config_1 = require("../config/server.config");
/**
 * Prints all registered routes in the application
 */
function printRoutes() {
    const routesMap = route_list_1.default.getRoutes(server_config_1.server, 'koa');
    route_list_1.default.printRoutes(routesMap);
}
