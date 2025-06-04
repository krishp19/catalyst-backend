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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(createUserDto) {
        const user = await this.usersService.create(createUserDto);
        const tokens = this.generateTokens({
            sub: user.id,
            username: user.username,
        });
        return {
            user,
            ...tokens,
        };
    }
    async login(loginDto) {
        try {
            const isEmail = loginDto.usernameOrEmail.includes('@');
            let user;
            if (isEmail) {
                user = await this.usersService.findByEmail(loginDto.usernameOrEmail);
            }
            else {
                user = await this.usersService.findByUsername(loginDto.usernameOrEmail);
            }
            const isPasswordValid = await user.comparePassword(loginDto.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const tokens = this.generateTokens({
                sub: user.id,
                username: user.username,
            });
            return {
                user,
                ...tokens,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findById(decoded.sub);
            return this.generateTokens({
                sub: user.id,
                username: user.username,
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
    generateTokens(payload) {
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
            }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map