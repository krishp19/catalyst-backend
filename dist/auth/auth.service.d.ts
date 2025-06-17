import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { TokenResponse } from '../common/interfaces';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private emailService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    register(createUserDto: CreateUserDto): Promise<{
        user: import("../users/entities/user.entity").User;
        accessToken: string;
        message: string;
    }>;
    sendOtpEmail(email: string): Promise<boolean>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: import("../users/entities/user.entity").User;
    }>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<TokenResponse & {
        user: any;
    }>;
    refreshToken(refreshToken: string): Promise<TokenResponse>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
    private generateTokens;
}
