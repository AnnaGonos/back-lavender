import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1742672162416 implements MigrationInterface {
    name = 'Auto1742672162416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "imageDescription" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "imageDescription"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "imageUrl"`);
    }

}
