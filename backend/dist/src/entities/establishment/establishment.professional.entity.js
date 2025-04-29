"use strict";
/**
 * EstablishmentProfessional Entity
 *
 * Represents the association between a professional account and an establishment,
 * including the role (lookup-based) and permissions.
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
exports.EstablishmentProfessional = void 0;
const typeorm_1 = require("typeorm");
const account_professional_entity_1 = require("../account/account.professional.entity");
const establishment_entity_1 = require("./establishment.entity");
let EstablishmentProfessional = class EstablishmentProfessional {
};
exports.EstablishmentProfessional = EstablishmentProfessional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EstablishmentProfessional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_professional_entity_1.ProfessionalAccount),
    (0, typeorm_1.JoinColumn)({ name: 'professional_account_id' }),
    __metadata("design:type", Object)
], EstablishmentProfessional.prototype, "professionalAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => establishment_entity_1.Establishment, 'professionals'),
    (0, typeorm_1.JoinColumn)({ name: 'establishment_id' }),
    __metadata("design:type", Object)
], EstablishmentProfessional.prototype, "establishment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EstablishmentProfessional.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EstablishmentProfessional.prototype, "created_at", void 0);
exports.EstablishmentProfessional = EstablishmentProfessional = __decorate([
    (0, typeorm_1.Entity)()
], EstablishmentProfessional);
