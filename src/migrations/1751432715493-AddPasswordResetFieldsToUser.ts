import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordResetFieldsToUser1751432715493 implements MigrationInterface {
    name = 'AddPasswordResetFieldsToUser1751432715493';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetOtp" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetOtp"`);
    }
}
