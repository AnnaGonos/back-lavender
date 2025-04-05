import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1743360073288 implements MigrationInterface {
    name = 'Auto1743360073288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."payment_method_enum" RENAME TO "payment_method_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_method_enum" AS ENUM('CASH', 'ONLINE')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "method" TYPE "public"."payment_method_enum" USING "method"::"text"::"public"."payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_method_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."order_paymentmethod_enum" RENAME TO "order_paymentmethod_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_paymentmethod_enum" AS ENUM('CASH', 'ONLINE')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paymentMethod" TYPE "public"."order_paymentmethod_enum" USING "paymentMethod"::"text"::"public"."order_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentmethod_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_paymentmethod_enum_old" AS ENUM('cash', 'online')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paymentMethod" TYPE "public"."order_paymentmethod_enum_old" USING "paymentMethod"::"text"::"public"."order_paymentmethod_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_paymentmethod_enum_old" RENAME TO "order_paymentmethod_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_method_enum_old" AS ENUM('cash', 'online')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "method" TYPE "public"."payment_method_enum_old" USING "method"::"text"::"public"."payment_method_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_method_enum_old" RENAME TO "payment_method_enum"`);
    }

}
