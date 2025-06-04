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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username },
            ],
        });
        if (existingUser) {
            if (existingUser.email === createUserDto.email) {
                throw new common_1.ConflictException('Email already in use');
            }
            else {
                throw new common_1.ConflictException('Username already taken');
            }
        }
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }
    async findAll(page = 1, limit = 10) {
        const [users, total] = await this.usersRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            items: users,
            meta: {
                totalItems: total,
                itemCount: users.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async getReputationBreakdown(userId) {
        const user = await this.findById(userId);
        return {
            totalScore: user.reputationScore,
            breakdown: {
                fromPosts: user.postScore,
                fromComments: user.commentScore,
                fromCommunities: user.communityScore,
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map