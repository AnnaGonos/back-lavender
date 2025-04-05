import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1743280706405 implements MigrationInterface {
    name = 'Auto1743280706405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "recipientName"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "recipientLastName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" ADD "recipientLastName" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "recipientName" character varying`);
    }

}
