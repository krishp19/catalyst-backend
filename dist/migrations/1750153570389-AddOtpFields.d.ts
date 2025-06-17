import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddOtpFields1750153570389 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
