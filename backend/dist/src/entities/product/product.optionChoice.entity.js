"use strict";
/**
 * ProductOptionChoice Entity
 *
 * Represents a selectable choice for a product option.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionChoice = void 0;
const typeorm_1 = require("typeorm");
const product_option_entity_1 = require("./product.option.entity");
let ProductOptionChoice = class ProductOptionChoice {
};
exports.ProductOptionChoice = ProductOptionChoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductOptionChoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_option_entity_1.ProductOption, (option) => option.choices),
    __metadata("design:type", Object)
], ProductOptionChoice.prototype, "productOption", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductOptionChoice.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductOptionChoice.prototype, "additionalCost", void 0);
exports.ProductOptionChoice = ProductOptionChoice = __decorate([
    (0, typeorm_1.Entity)()
], ProductOptionChoice);
