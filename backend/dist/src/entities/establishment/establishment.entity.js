"use strict";
/**
 * Establishment Entity
 *
 * Represents a business establishment.
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
exports.Establishment = void 0;
const typeorm_1 = require("typeorm");
const establishment_hours_entity_1 = require("./establishment.hours.entity");
const establishment_professional_entity_1 = require("./establishment.professional.entity");
const category_entity_1 = require("../category/category.entity");
const product_entity_1 = require("../product/product.entity");
const order_entity_1 = require("../order/order.entity");
const account_professional_entity_1 = require("../account/account.professional.entity");
let Establishment = class Establishment {
};
exports.Establishment = Establishment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Establishment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Establishment.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Establishment.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Establishment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Establishment.prototype, "productsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Establishment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Establishment.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Establishment.prototype, "banner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_professional_entity_1.ProfessionalAccount, (professional) => professional.establishments),
    (0, typeorm_1.JoinColumn)({ name: 'professional_account_id' }),
    __metadata("design:type", Object)
], Establishment.prototype, "professionalAccount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Establishment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Establishment.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => establishment_hours_entity_1.EstablishmentHours, (hours) => hours.establishment),
    __metadata("design:type", Object)
], Establishment.prototype, "hours", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => establishment_professional_entity_1.EstablishmentProfessional, (establishmentProfessional) => establishmentProfessional.establishment),
    __metadata("design:type", Object)
], Establishment.prototype, "professionals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => category_entity_1.Category, (category) => category.establishment),
    __metadata("design:type", Object)
], Establishment.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.establishment),
    __metadata("design:type", Object)
], Establishment.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.establishment),
    __metadata("design:type", Object)
], Establishment.prototype, "orders", void 0);
exports.Establishment = Establishment = __decorate([
    (0, typeorm_1.Entity)()
], Establishment);
