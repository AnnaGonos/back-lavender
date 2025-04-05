import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1743356774710 implements MigrationInterface {
    name = 'Auto1743356774710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "delivery_schedule" ("id" SERIAL NOT NULL, "specificDate" date, "dayOfWeek" "public"."delivery_schedule_dayofweek_enum", "isActive" boolean NOT NULL DEFAULT true, "timeSlotId" integer, CONSTRAINT "PK_97a65f0c2ee99c7e28984c45352" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_time_slot" ("id" SERIAL NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f30ed33b39da13a29c9ea0ee74c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryAddress" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."order_deliverytype_enum" RENAME TO "order_deliverytype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_deliverytype_enum" AS ENUM('delivery', 'courier')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryType" TYPE "public"."order_deliverytype_enum" USING "deliveryType"::"text"::"public"."order_deliverytype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverytype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "delivery_schedule" ADD CONSTRAINT "FK_81977d1004f23c08a3894906a51" FOREIGN KEY ("timeSlotId") REFERENCES "delivery_time_slot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_schedule" DROP CONSTRAINT "FK_81977d1004f23c08a3894906a51"`);
        await queryRunner.query(`CREATE TYPE "public"."order_deliverytype_enum_old" AS ENUM('pickup', 'address')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryType" TYPE "public"."order_deliverytype_enum_old" USING "deliveryType"::"text"::"public"."order_deliverytype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverytype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_deliverytype_enum_old" RENAME TO "order_deliverytype_enum"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryAddress"`);
        await queryRunner.query(`DROP TABLE "delivery_time_slot"`);
        await queryRunner.query(`DROP TABLE "delivery_schedule"`);
    }

}
