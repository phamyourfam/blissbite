"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seeder_1 = require("./src/config/seeder");
const seed_generator_1 = require("./src/config/seed-generator");
const database_config_1 = require("./src/config/database.config");
const findOrCreateDirectory_util_1 = require("./src/utils/findOrCreateDirectory.util");
const path_1 = __importDefault(require("path"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create seeds directory structure
            const seedsPath = path_1.default.join(process.cwd(), 'seeds');
            (0, findOrCreateDirectory_util_1.findOrCreateDirectory)(seedsPath);
            (0, findOrCreateDirectory_util_1.findOrCreateDirectory)(path_1.default.join(seedsPath, 'establishments'));
            (0, findOrCreateDirectory_util_1.findOrCreateDirectory)(path_1.default.join(seedsPath, 'products'));
            (0, findOrCreateDirectory_util_1.findOrCreateDirectory)(path_1.default.join(seedsPath, 'accounts'));
            // Initialize the database connection
            const dataSource = yield database_config_1.database.initialize();
            console.log('Database connection initialized');
            // Generate example seed files
            console.log('\nGenerating example seed files...');
            yield (0, seed_generator_1.generateExampleSeeds)(dataSource);
            // Run the seeder
            console.log('\nRunning seeder...');
            yield (0, seeder_1.runSeeder)(dataSource);
            // Close the database connection
            yield dataSource.destroy();
            console.log('\nDatabase connection closed');
        }
        catch (error) {
            console.error('Error during seeding:', error);
            process.exit(1);
        }
    });
}
main();
