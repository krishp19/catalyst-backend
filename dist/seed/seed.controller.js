"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const seed_service_1 = require("./seed.service");
let SeedController = class SeedController {
    constructor(seedService) {
        this.seedService = seedService;
    }
    async seed(force) {
        await this.seedService.onModuleInit(force);
        return {
            message: 'Database seeded successfully',
            forceReseed: force
        };
    }
};
exports.SeedController = SeedController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Seed the database with initial data' }),
    (0, swagger_1.ApiQuery)({ name: 'force', required: false, type: Boolean, description: 'Force reseed even if data exists' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Database seeded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin access required' }),
    __param(0, (0, common_1.Query)('force', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], SeedController.prototype, "seed", null);
exports.SeedController = SeedController = __decorate([
    (0, swagger_1.ApiTags)('seed'),
    (0, common_1.Controller)('seed'),
    __metadata("design:paramtypes", [seed_service_1.SeedService])
], SeedController);
//# sourceMappingURL=seed.controller.js.map