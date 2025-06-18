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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.initializeTransporter();
    }
    initializeTransporter() {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: this.configService.get('EMAIL_SECURE') === 'true',
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
        });
    }
    async sendOtpEmail(email, otpCode, emailType = 'verify-email') {
        const mailOptions = {
            from: `"Catalyst Community" <${this.configService.get('EMAIL_USER')}>`,
            to: email,
            subject: emailType === 'forgot-password' ? '🔑 Password Reset Request | Catalyst' : '🔑 Verify Your Email Address | Catalyst',
            html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email | Catalyst</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #FF6B35 0%, #FF9E2C 100%); padding: 30px 0; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: 700; text-decoration: none; }
          .content { padding: 40px 30px; color: #333333; }
          .otp-container { 
            background: #FFF8F2; 
            border-radius: 12px; 
            padding: 25px; 
            margin: 30px 0; 
            text-align: center;
            border: 1px solid #FFE5D4;
          }
          .otp-code { 
            font-size: 36px; 
            font-weight: 700; 
            letter-spacing: 4px; 
            color: #FF6B35;
            margin: 15px 0;
            font-family: 'Courier New', Courier, monospace;
            word-spacing: 8px;
            line-height: 1.4;
            display: inline-block;
            padding: 0 5px;
          }
          @media screen and (max-width: 480px) {
            .otp-code {
              font-size: 28px;
              letter-spacing: 2px;
              word-spacing: 6px;
              line-height: 1.6;
            }
          }
          @media screen and (max-width: 320px) {
            .otp-code {
              font-size: 24px;
              letter-spacing: 1px;
              word-spacing: 4px;
            }
          }
          .divider { 
            border: 0; 
            height: 1px; 
            background: linear-gradient(90deg, transparent, #FFD4B8, transparent);
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #FF6B35 0%, #FF9E2C 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 10px 0;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
          }
          .button:hover {
            background: linear-gradient(135deg, #E85A2A 0%, #E88D1A 100%);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
          }
          .footer { 
            padding: 20px 30px; 
            text-align: center; 
            color: #888888; 
            font-size: 13px;
            border-top: 1px solid #F0F0F0;
          }
          .social-links { margin: 20px 0; }
          .social-link { 
            display: inline-block; 
            margin: 0 10px; 
            color: #FF6B35; 
            text-decoration: none;
          }
          .expiry-note {
            background: #FFF5F0;
            border-left: 4px solid #FF6B35;
            padding: 12px 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Catalyst</div>
          </div>
          
          <div class="content">
            <h2 style="color: #2D3748; margin-top: 0;">Welcome to Catalyst! 👋</h2>
            <p>Thank you for joining our community! To complete your registration, please verify your email address by entering the following one-time passcode:</p>
            
            <div class="otp-container">
              <p style="margin: 0 0 10px 0; color: #4A5568;">Your verification code:</p>
              <div class="otp-code" style="font-family: 'Courier New', monospace; letter-spacing: 8px; font-size: 28px; font-weight: 700; color: #FF6B35; padding: 10px 0; cursor: pointer;" onclick="navigator.clipboard.writeText('${otpCode}')" title="Click to copy">
                ${otpCode}
              </div>
              <p style="margin: 10px 0 0 0; color: #718096; font-size: 14px;">This code will expire in 10 minutes <span style="color: #FF6B35;">• Click code to copy</span></p>
            </div>
            
            <div class="expiry-note">
              ⏳ For security reasons, this code will expire in 10 minutes. Please do not share this code with anyone.
            </div>
            
            <p>If you didn't request this email, you can safely ignore it. Your account is safe.</p>
            
            <hr class="divider">
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 5px;">Need help?</p>
            <p style="margin-top: 5px; font-size: 14px;">Contact our support team at <a href="mailto:support@catalyst.com" style="color: #FF6B35; text-decoration: none;">support@catalyst.com</a></p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">Twitter</a>
              <span>•</span>
              <a href="#" class="social-link">Facebook</a>
              <span>•</span>
              <a href="#" class="social-link">Instagram</a>
              <span>•</span>
              <a href="#" class="social-link">LinkedIn</a>
            </div>
            <p>© ${new Date().getFullYear()} Catalyst. All rights reserved.</p>
            <p style="font-size: 12px; color: #A0AEC0;">
              You're receiving this email because you created an account on Catalyst.
              <br>
              <a href="#" style="color: #A0AEC0; text-decoration: underline;">Unsubscribe</a> | 
              <a href="#" style="color: #A0AEC0; text-decoration: underline;">Privacy Policy</a> | 
              <a href="#" style="color: #A0AEC0; text-decoration: underline;">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
      </html>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`OTP email sent to ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send OTP email to ${email}`, error.stack);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map