import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendOtpEmail(email: string, otpCode: string, emailType?: 'verify-email' | 'forgot-password'): Promise<boolean>;
}
