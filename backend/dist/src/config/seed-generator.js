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
exports.SeedGenerator = void 0;
exports.generateExampleSeeds = generateExampleSeeds;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const mkdir = (0, util_1.promisify)(fs_1.default.mkdir);
class SeedGenerator {
    constructor(dataSource, seedsPath) {
        this.dataSource = dataSource;
        this.seedsPath = seedsPath;
    }
    getFieldInfo(entity) {
        const fields = [];
        const metadata = this.dataSource.getMetadata(entity);
        for (const column of metadata.columns) {
            fields.push({
                name: column.propertyName,
                type: column.type.toString(),
                isNullable: column.isNullable,
                isArray: column.isArray,
                defaultValue: column.default
            });
        }
        return fields;
    }
    generateExampleValue(field) {
        if (field.isArray) {
            return [];
        }
        switch (field.type.toLowerCase()) {
            case 'string':
                return field.name === 'id' ? 'example-id' : `Example ${field.name}`;
            case 'number':
            case 'int':
            case 'integer':
                return 0;
            case 'decimal':
            case 'float':
                return 0.0;
            case 'boolean':
                return true;
            case 'date':
                return new Date().toISOString();
            case 'text':
                return `This is an example ${field.name} text.`;
            default:
                return null;
        }
    }
    generateExampleData(entity) {
        const fields = this.getFieldInfo(entity);
        const data = {};
        for (const field of fields) {
            if (field.name !== 'id') { // Skip id as it will be set by filename
                data[field.name] = this.generateExampleValue(field);
            }
        }
        return data;
    }
    generateExampleSeeds() {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = this.dataSource.entityMetadatas;
            for (const entity of entities) {
                const entityName = entity.name.toLowerCase();
                const entityPath = path_1.default.join(this.seedsPath, entityName);
                // Create directory if it doesn't exist
                try {
                    yield mkdir(entityPath, { recursive: true });
                }
                catch (error) {
                    if (error.code !== 'EEXIST') {
                        throw error;
                    }
                }
                // Generate example data
                const exampleData = this.generateExampleData(entity.target);
                const fileName = path_1.default.join(entityPath, 'example.json');
                yield writeFile(fileName, JSON.stringify(exampleData, null, 2), 'utf8');
                console.log(`Generated example seed for ${entityName}`);
            }
        });
    }
}
exports.SeedGenerator = SeedGenerator;
// Example usage:
function generateExampleSeeds(dataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        const generator = new SeedGenerator(dataSource, path_1.default.join(process.cwd(), 'seeds'));
        yield generator.generateExampleSeeds();
        console.log('Example seed files generated successfully!');
    });
}
