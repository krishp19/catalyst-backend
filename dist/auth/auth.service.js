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
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async register(createUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const user = await this.usersService.create(createUserDto);
        await this.sendOtpEmail(user.email);
        return {
            user,
            message: 'Registration successful. Please check your email for the OTP to verify your account.',
        };
    }
    async sendOtpEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.generateOtpCode();
        const updateData = {
            otpCode: user.otpCode,
            otpExpires: user.otpExpires,
        };
        await this.usersService.update(user.id, updateData);
        return this.emailService.sendOtpEmail(user.email, user.otpCode);
    }
    async verifyOtp(verifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const isOtpValid = user.verifyOtpCode(otp);
        if (!isOtpValid) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        user.isEmailVerified = true;
        user.otpCode = null;
        user.otpExpires = null;
        await this.usersService.update(user.id, user);
        return {
            user,
            message: 'Email verified successfully',
        };
    }
    async resendOtp(resendOtpDto) {
        const { email } = resendOtpDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        if (user.otpExpires && user.otpExpires > new Date()) {
            const secondsLeft = Math.ceil((user.otpExpires.getTime() - Date.now()) / 1000);
            throw new common_1.BadRequestException(`Please wait ${secondsLeft} seconds before requesting a new OTP`);
        }
        await this.sendOtpEmail(email);
        return {
            success: true,
            message: 'New OTP sent to your email',
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
            if (!user.isEmailVerified) {
                throw new common_1.UnauthorizedException('Please verify your email before logging in');
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
    generateAccessToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
        });
    }
    generateRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
        });
    }
    generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map