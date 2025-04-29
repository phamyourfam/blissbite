"use strict";
/**
 * PersonalAccount Entity
 *
 * Represents a personal account with consumer-specific properties.
 * Has a one-to-one relationship with the base Account entity.
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
exports.PersonalAccount = void 0;
const typeorm_1 = require("typeorm");
const account_entity_1 = require("./account.entity");
let PersonalAccount = class PersonalAccount {
};
exports.PersonalAccount = PersonalAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PersonalAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => account_entity_1.Account, 'personalAccount'),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", Object)
], PersonalAccount.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PersonalAccount.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PersonalAccount.prototype, "preferences", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PersonalAccount.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PersonalAccount.prototype, "updated_at", void 0);
exports.PersonalAccount = PersonalAccount = __decorate([
    (0, typeorm_1.Entity)()
], PersonalAccount);
