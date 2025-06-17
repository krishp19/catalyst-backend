"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOtpFields1750153570389 = void 0;
class AddOtpFields1750153570389 {
    constructor() {
        this.name = 'AddOtpFields1750153570389';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpCode" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpires" TIMESTAMP`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpCode"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isEmailVerified"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isVerified" boolean NOT NULL DEFAULT false`);
    }
}
exports.AddOtpFields1750153570389 = AddOtpFields1750153570389;
//# sourceMappingURL=1750153570389-AddOtpFields.js.map