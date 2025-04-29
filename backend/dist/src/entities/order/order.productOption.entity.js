"use strict";
/**
 * OrderProductOption Entity
 *
 * Represents an option selected for an ordered product.
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
exports.OrderProductOption = void 0;
const typeorm_1 = require("typeorm");
const order_product_entity_1 = require("./order.product.entity");
const product_optionChoice_entity_1 = require("../product/product.optionChoice.entity");
let OrderProductOption = class OrderProductOption {
};
exports.OrderProductOption = OrderProductOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderProductOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_product_entity_1.OrderProduct, (product) => product.options),
    __metadata("design:type", Object)
], OrderProductOption.prototype, "orderProduct", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_optionChoice_entity_1.ProductOptionChoice),
    __metadata("design:type", Object)
], OrderProductOption.prototype, "productOptionChoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OrderProductOption.prototype, "additionalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrderProductOption.prototype, "notes", void 0);
exports.OrderProductOption = OrderProductOption = __decorate([
    (0, typeorm_1.Entity)()
], OrderProductOption);
