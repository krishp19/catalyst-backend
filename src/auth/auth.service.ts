import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, TokenResponse } from '../common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
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

  async login(loginDto: LoginDto): Promise<TokenResponse & { user: any }> {
    try {
      // Determine if input is email or username
      const isEmail = loginDto.usernameOrEmail.includes('@');
      let user;
      
      if (isEmail) {
        user = await this.usersService.findByEmail(loginDto.usernameOrEmail);
      } else {
        user = await this.usersService.findByUsername(loginDto.usernameOrEmail);
      }
      
      const isPasswordValid = await user.comparePassword(loginDto.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const tokens = this.generateTokens({
        sub: user.id,
        username: user.username,
      });
      
      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      
      const user = await this.usersService.findById(decoded.sub);
      
      return this.generateTokens({
        sub: user.id,
        username: user.username,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // In a real-world application, you would typically:
    // 1. Invalidate refresh tokens in a database
    // 2. Add tokens to a blacklist/deny list
    // For this implementation, we'll keep it simple
    return { message: 'Logged out successfully' };
  }

  private generateTokens(payload: JwtPayload): TokenResponse {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION', '1h'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    };
  }
}