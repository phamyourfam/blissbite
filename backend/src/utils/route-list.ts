import RouteList from 'route-list';
import { server } from '../config/server.config';

/**
 * Prints all registered routes in the application
 */
export function printRoutes(): void {
    const routesMap = RouteList.getRoutes(server, 'koa');
    RouteList.printRoutes(routesMap);
} 