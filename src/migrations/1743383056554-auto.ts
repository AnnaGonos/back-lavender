import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1743383056554 implements MigrationInterface {
    name = 'Auto1743383056554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."order_deliverytype_enum" RENAME TO "order_deliverytype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_deliverytype_enum" AS ENUM('pickup', 'courier')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryType" TYPE "public"."order_deliverytype_enum" USING "deliveryType"::"text"::"public"."order_deliverytype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverytype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_deliverytype_enum_old" AS ENUM('delivery', 'courier')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryType" TYPE "public"."order_deliverytype_enum_old" USING "deliveryType"::"text"::"public"."order_deliverytype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverytype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_deliverytype_enum_old" RENAME TO "order_deliverytype_enum"`);
    }

}
