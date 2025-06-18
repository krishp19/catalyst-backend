import { Injectable, UnauthorizedException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyForgotPasswordOtpDto } from './dto/verify-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtPayload, TokenResponse } from '../common/interfaces';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';

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
  
  async sendOtpEmail(email: string, isPasswordReset: boolean = false): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    const updateData: UpdateUserDto = {
      ...(isPasswordReset 
        ? { 
            passwordResetOtp: otp, 
            passwordResetExpires: otpExpires // Use Date object directly
          } 
        : {
            otpCode: otp,
            otpExpires: otpExpires // Use Date object directly
          })
    };

    await this.usersService.update(user.id, updateData);

    // Send OTP email using the EmailService
    await this.emailService.sendOtpEmail(
      user.email, 
      otp,
      isPasswordReset ? 'forgot-password' : 'verify-email'
    );

    return true;
  }

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return { message: 'No account found with this email address' };
    }

    await this.sendOtpEmail(email, true);
    
    return { 
      message: 'Password reset OTP has been sent to your email' 
    };
  }

  async verifyPasswordResetOtp(verifyOtpDto: VerifyForgotPasswordOtpDto): Promise<{ message: string }> {
    const { email, otp } = verifyOtpDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if OTP matches and is not expired
    if (user.passwordResetOtp !== otp || new Date() > new Date(user.passwordResetExpires)) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    return { message: 'OTP verified successfully' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = resetPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify OTP again before allowing password reset
    if (user.passwordResetOtp !== otp || new Date() > new Date(user.passwordResetExpires)) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Update the password and clear the reset OTP
    await this.usersService.update(user.id, {
      password: newPassword, // The service will hash the password
      passwordResetOtp: null,
      passwordResetExpires: null,
    } as UpdateUserDto);

    return { message: 'Password has been reset successfully' };
  }
  
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string; user: User }> {
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
    if (!user.otpCode || user.otpCode !== otp || new Date() > new Date(user.otpExpires)) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    
    // Mark email as verified and clear OTP
    await this.usersService.update(user.id, {
      isEmailVerified: true,
      otpCode: null,
      otpExpires: null,
    } as UpdateUserDto);
    
    // Return user and success message (no tokens)
    return {
      user,
      message: 'Email verified successfully',
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ success: boolean; message: string }> {
    const { email } = resendOtpDto;
    
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    
    // Check if we need to wait before resending (rate limiting)
    if (user.otpExpires && new Date(user.otpExpires) > new Date()) {
      const secondsLeft = Math.ceil((new Date(user.otpExpires).getTime() - Date.now()) / 1000);
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

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    // Determine if input is email or username
    const isEmail = loginDto.usernameOrEmail.includes('@');
    let user: any; // TODO: Replace 'any' with proper User type
    
    try {
      if (isEmail) {
        user = await this.usersService.findByEmail(loginDto.usernameOrEmail);
      } else {
        user = await this.usersService.findByUsername(loginDto.usernameOrEmail);
      }
      
      if (!user) {
        throw new UnauthorizedException('No user found with the provided credentials');
      }
      
      // Check if email is verified
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email before logging in');
      }
      
      const isPasswordValid = await user.comparePassword(loginDto.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
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
      // If it's already an UnauthorizedException, just rethrow it
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // For other errors, log them and return a generic message
      console.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }


  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify<{ sub: string; username: string; type: string }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
      
      const user = await this.usersService.findById(decoded.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
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