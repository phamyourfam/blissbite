"use strict";
/**
 * ProfessionalAccount Entity
 *
 * Contains additional information for professional user accounts.
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
exports.ProfessionalAccount = void 0;
const typeorm_1 = require("typeorm");
const account_entity_1 = require("./account.entity");
const establishment_entity_1 = require("../establishment/establishment.entity");
let ProfessionalAccount = class ProfessionalAccount {
};
exports.ProfessionalAccount = ProfessionalAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProfessionalAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => account_entity_1.Account, (account) => account.professionalAccount),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", Object)
], ProfessionalAccount.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfessionalAccount.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfessionalAccount.prototype, "business_registration_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfessionalAccount.prototype, "tax_identification_number", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => establishment_entity_1.Establishment, (establishment) => establishment.professionalAccount),
    __metadata("design:type", Array)
], ProfessionalAccount.prototype, "establishments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProfessionalAccount.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProfessionalAccount.prototype, "updated_at", void 0);
exports.ProfessionalAccount = ProfessionalAccount = __decorate([
    (0, typeorm_1.Entity)()
], ProfessionalAccount);
