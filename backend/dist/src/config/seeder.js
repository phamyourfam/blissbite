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
exports.Seeder = void 0;
exports.runSeeder = runSeeder;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const readdir = (0, util_1.promisify)(fs_1.default.readdir);
const stat = (0, util_1.promisify)(fs_1.default.stat);
class Seeder {
    constructor(config) {
        this.dataSource = config.dataSource;
        this.seedsPath = config.seedsPath;
    }
    readJsonFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield readFile(filePath, 'utf8');
            return JSON.parse(content);
        });
    }
    scanSeedDirectory(entityName) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityPath = path_1.default.join(this.seedsPath, entityName);
            try {
                const files = yield readdir(entityPath);
                return files.filter(file => file.endsWith('.json'));
            }
            catch (error) {
                console.warn(`No seed directory found for entity: ${entityName}`);
                return [];
            }
        });
    }
    processSeedFile(entityName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(this.seedsPath, entityName, fileName);
            const id = fileName.replace('.json', '');
            try {
                const data = yield this.readJsonFile(filePath);
                // Set the id if not present in the JSON
                if (!data.id) {
                    data.id = id;
                }
                const repository = this.dataSource.getRepository(entityName);
                // Check if record exists
                const existing = yield repository.findOneBy({ id });
                if (existing) {
                    console.log(`Skipping ${entityName} with id ${id} - already exists`);
                    return false;
                }
                // Insert new record
                yield repository.save(data);
                console.log(`Inserted ${entityName} with id ${id}`);
                return true;
            }
            catch (error) {
                console.error(`Error processing seed file ${filePath}:`, error);
                return false;
            }
        });
    }
    seed() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            try {
                // Get all entity directories
                const entities = yield readdir(this.seedsPath);
                for (const entityName of entities) {
                    const entityPath = path_1.default.join(this.seedsPath, entityName);
                    const stats = yield stat(entityPath);
                    if (stats.isDirectory()) {
                        const seedFiles = yield this.scanSeedDirectory(entityName);
                        let inserted = 0;
                        let skipped = 0;
                        for (const file of seedFiles) {
                            const wasInserted = yield this.processSeedFile(entityName, file);
                            if (wasInserted) {
                                inserted++;
                            }
                            else {
                                skipped++;
                            }
                        }
                        results.push({ entity: entityName, inserted, skipped });
                    }
                }
            }
            catch (error) {
                console.error('Error during seeding:', error);
            }
            return results;
        });
    }
}
exports.Seeder = Seeder;
// Example usage:
function runSeeder(dataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        const seeder = new Seeder({
            dataSource,
            seedsPath: path_1.default.join(process.cwd(), 'seeds')
        });
        const results = yield seeder.seed();
        console.log('\nSeeding Results:');
        results.forEach(result => {
            console.log(`${result.entity}:`);
            console.log(`  Inserted: ${result.inserted}`);
            console.log(`  Skipped: ${result.skipped}`);
        });
    });
}
