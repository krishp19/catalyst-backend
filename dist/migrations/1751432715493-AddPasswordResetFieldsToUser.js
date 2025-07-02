"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPasswordResetFieldsToUser1751432715493 = void 0;
class AddPasswordResetFieldsToUser1751432715493 {
    constructor() {
        this.name = 'AddPasswordResetFieldsToUser1751432715493';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetOtp" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetExpires" TIMESTAMP`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetOtp"`);
    }
}
exports.AddPasswordResetFieldsToUser1751432715493 = AddPasswordResetFieldsToUser1751432715493;
//# sourceMappingURL=1751432715493-AddPasswordResetFieldsToUser.js.map