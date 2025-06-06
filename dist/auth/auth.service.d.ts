import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponse } from '../common/interfaces';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(createUserDto: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("../users/entities/user.entity").User;
    }>;
    login(loginDto: LoginDto): Promise<TokenResponse & {
        user: any;
    }>;
    refreshToken(refreshToken: string): Promise<TokenResponse>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
}
