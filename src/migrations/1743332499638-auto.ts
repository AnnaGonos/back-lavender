import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1743332499638 implements MigrationInterface {
    name = 'Auto1743332499638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_deliverytype_enum" AS ENUM('pickup', 'address')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryType" "public"."order_deliverytype_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryDate" date`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryInterval" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."order_paymentmethod_enum" AS ENUM('cash', 'online')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "paymentMethod" "public"."order_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalAmount" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "totalAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryInterval"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryDate"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryType"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverytype_enum"`);
    }

}
