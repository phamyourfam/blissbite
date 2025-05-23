"use strict";
/**
 * EstablishmentHours Entity
 *
 * Represents the operating hours for an establishment.
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
exports.EstablishmentHours = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
let EstablishmentHours = class EstablishmentHours {
};
exports.EstablishmentHours = EstablishmentHours;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EstablishmentHours.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => _1.Establishment, (est) => est.hours),
    (0, typeorm_1.JoinColumn)({ name: 'establishment_id' }),
    __metadata("design:type", Object)
], EstablishmentHours.prototype, "establishment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EstablishmentHours.prototype, "day_of_week", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], EstablishmentHours.prototype, "opening_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], EstablishmentHours.prototype, "closing_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], EstablishmentHours.prototype, "is_closed", void 0);
exports.EstablishmentHours = EstablishmentHours = __decorate([
    (0, typeorm_1.Entity)()
], EstablishmentHours);
