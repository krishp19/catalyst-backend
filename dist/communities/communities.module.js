"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const communities_service_1 = require("./communities.service");
const communities_controller_1 = require("./communities.controller");
const community_entity_1 = require("./entities/community.entity");
const community_member_entity_1 = require("./entities/community-member.entity");
const reputation_module_1 = require("../reputation/reputation.module");
const users_module_1 = require("../users/users.module");
const topics_module_1 = require("../topics/topics.module");
let CommunitiesModule = class CommunitiesModule {
};
exports.CommunitiesModule = CommunitiesModule;
exports.CommunitiesModule = CommunitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([community_entity_1.Community, community_member_entity_1.CommunityMember]),
            reputation_module_1.ReputationModule,
            users_module_1.UsersModule,
            (0, common_1.forwardRef)(() => topics_module_1.TopicsModule),
        ],
        controllers: [communities_controller_1.CommunitiesController],
        providers: [communities_service_1.CommunitiesService],
        exports: [communities_service_1.CommunitiesService],
    })
], CommunitiesModule);
//# sourceMappingURL=communities.module.js.map