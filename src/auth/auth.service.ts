import { Injectable, UnauthorizedException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { JwtPayload, TokenResponse } from '../common/interfaces';
import { EmailService } from '../email/email.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Check if user with this email already exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create the user (isEmailVerified is false by default)
    const user = await this.usersService.create(createUserDto);
    
    // Generate and save OTP
    await this.sendOtpEmail(user.email);
    
    // Return user and success message (no tokens)
    return {
      user,
      message: 'Registration successful. Please check your email for the OTP to verify your account.',
    };
  }
  
  async sendOtpEmail(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Generate and save OTP
    user.generateOtpCode();
    const updateData: Partial<UpdateUserDto & { otpCode: string; otpExpires: Date }> = {
      otpCode: user.otpCode,
      otpExpires: user.otpExpires,
    };
    await this.usersService.update(user.id, updateData as UpdateUserDto);
    
    // Send OTP email
    return this.emailService.sendOtpEmail(user.email, user.otpCode);
  }
  
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check if email is already verified
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    
    // Verify OTP
    const isOtpValid = user.verifyOtpCode(otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    
    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await this.usersService.update(user.id, user);
    
    // Return user and success message (no tokens)
    return {
      user,
      message: 'Email verified successfully',
    };
  }
  
  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { email } = resendOtpDto;
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    
    // Check if we need to wait before resending (rate limiting)
    if (user.otpExpires && user.otpExpires > new Date()) {
      const secondsLeft = Math.ceil((user.otpExpires.getTime() - Date.now()) / 1000);
      throw new BadRequestException(
        `Please wait ${secondsLeft} seconds before requesting a new OTP`
      );
    }
    
    // Send new OTP
    await this.sendOtpEmail(email);
    
    return {
      success: true,
      message: 'New OTP sent to your email',
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
      
      // Check if email is verified
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email before logging in');
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

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '1h'),
    });
  }

  private generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });
  }

  private generateTokens(payload: JwtPayload): TokenResponse {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}