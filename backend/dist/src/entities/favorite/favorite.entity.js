"use strict";
/**
 * Favorite Entity
 *
 * Represents a favorite marking by an account for a favorable entity.
 * Uses a polymorphic approach via favorable_id and favorable_type lookup.
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
exports.Favorite = void 0;
const typeorm_1 = require("typeorm");
const account_entity_1 = require("../account/account.entity");
let Favorite = class Favorite {
};
exports.Favorite = Favorite;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Favorite.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.Account, 'favorites'),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", Object)
], Favorite.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Favorite.prototype, "favorable_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Favorite.prototype, "created_at", void 0);
exports.Favorite = Favorite = __decorate([
    (0, typeorm_1.Entity)()
], Favorite);
