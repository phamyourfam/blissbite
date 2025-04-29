"use strict";
/**
 * ProductOption Entity
 *
 * Represents a customizable option for a product.
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
exports.ProductOption = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const product_optionChoice_entity_1 = require("./product.optionChoice.entity");
let ProductOption = class ProductOption {
};
exports.ProductOption = ProductOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.options),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Object)
], ProductOption.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductOption.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductOption.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ProductOption.prototype, "min_selections", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ProductOption.prototype, "max_selections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_optionChoice_entity_1.ProductOptionChoice, (choice) => choice.productOption),
    __metadata("design:type", Object)
], ProductOption.prototype, "choices", void 0);
exports.ProductOption = ProductOption = __decorate([
    (0, typeorm_1.Entity)()
], ProductOption);
