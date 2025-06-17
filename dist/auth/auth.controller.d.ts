import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        user: User;
        accessToken: string;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<import("../common/interfaces").TokenResponse & {
        user: any;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<import("../common/interfaces").TokenResponse>;
    logout(user: User): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
