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
exports.VerifyForgotPasswordOtpResponseDto = exports.VerifyForgotPasswordOtpDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class VerifyForgotPasswordOtpDto {
}
exports.VerifyForgotPasswordOtpDto = VerifyForgotPasswordOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'The email address that received the OTP',
        required: true
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], VerifyForgotPasswordOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: 'The 6-digit OTP sent to the email',
        required: true,
        minLength: 6,
        maxLength: 6
    }),
    (0, class_validator_1.IsString)({ message: 'OTP must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'OTP is required' }),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP must be 6 digits' }),
    __metadata("design:type", String)
], VerifyForgotPasswordOtpDto.prototype, "otp", void 0);
class VerifyForgotPasswordOtpResponseDto {
}
exports.VerifyForgotPasswordOtpResponseDto = VerifyForgotPasswordOtpResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'OTP verified successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], VerifyForgotPasswordOtpResponseDto.prototype, "message", void 0);
//# sourceMappingURL=verify-forgot-password-otp.dto.js.map