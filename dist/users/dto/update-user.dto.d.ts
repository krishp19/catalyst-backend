export declare class UpdateUserDto {
    bio?: string;
    avatarUrl?: string;
    email?: string;
    isEmailVerified?: boolean;
    passwordResetOtp?: string;
    passwordResetExpires?: string | Date;
    password?: string;
    otpCode?: string;
    otpExpires?: Date;
}
