"use strict";
/**
 * Account Entity
 *
 * Represents a user account. This entity stores basic account
 * information and defines relationships to personal/professional
 * details, sessions, verifications, orders, reviews, and favorites.
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
exports.Account = void 0;
const typeorm_1 = require("typeorm");
const authentication_session_entity_1 = require("../authentication/authentication.session.entity");
const favorite_entity_1 = require("../favorite/favorite.entity");
const order_entity_1 = require("../order/order.entity");
const review_entity_1 = require("../review/review.entity");
const account_status_entity_1 = require("./account.status.entity");
const account_professional_entity_1 = require("./account.professional.entity");
const account_personal_entity_1 = require("./account.personal.entity");
const account_verification_entity_1 = require("./account.verification.entity");
let Account = class Account {
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Account.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "forename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "surname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Account.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Account.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => account_status_entity_1.AccountStatus, (status) => status.account, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], Account.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => account_personal_entity_1.PersonalAccount, 'account'),
    __metadata("design:type", Object)
], Account.prototype, "personalAccount", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => account_professional_entity_1.ProfessionalAccount, (professional) => professional.account),
    __metadata("design:type", Object)
], Account.prototype, "professionalAccount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => authentication_session_entity_1.Session, (session) => session.account),
    __metadata("design:type", Array)
], Account.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => account_verification_entity_1.AccountVerification, (verification) => verification.account),
    __metadata("design:type", Array)
], Account.prototype, "verifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.account),
    __metadata("design:type", Array)
], Account.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.account),
    __metadata("design:type", Array)
], Account.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => favorite_entity_1.Favorite, (favorite) => favorite.account),
    __metadata("design:type", Array)
], Account.prototype, "favorites", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)()
], Account);
