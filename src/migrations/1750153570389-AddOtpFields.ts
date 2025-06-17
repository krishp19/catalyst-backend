import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpFields1750153570389 implements MigrationInterface {
    name = 'AddOtpFields1750153570389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpCode" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpCode"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isEmailVerified"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isVerified" boolean NOT NULL DEFAULT false`);
    }

}
