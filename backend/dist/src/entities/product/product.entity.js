"use strict";
/**
 * Product Entity
 *
 * Represents a product offered by an establishment.
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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const establishment_entity_1 = require("../establishment/establishment.entity");
const order_product_entity_1 = require("../order/order.product.entity");
const product_category_entity_1 = require("./product.category.entity");
const product_option_entity_1 = require("./product.option.entity");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => establishment_entity_1.Establishment, (est) => est.products),
    (0, typeorm_1.JoinColumn)({ name: 'establishment_id' }),
    __metadata("design:type", Object)
], Product.prototype, "establishment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], Product.prototype, "base_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_available", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "preparation_time", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "image_urls", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_category_entity_1.ProductCategory, (productCategory) => productCategory.product),
    __metadata("design:type", Object)
], Product.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_category_entity_1.ProductCategory, (pc) => pc.product),
    __metadata("design:type", Object)
], Product.prototype, "productCategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_option_entity_1.ProductOption, (option) => option.product),
    __metadata("design:type", Object)
], Product.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_product_entity_1.OrderProduct, (orderProduct) => orderProduct.product),
    __metadata("design:type", Object)
], Product.prototype, "orderProducts", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)()
], Product);
