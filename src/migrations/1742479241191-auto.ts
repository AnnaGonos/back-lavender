import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1742479241191 implements MigrationInterface {
    name = 'Auto1742479241191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_method_enum" AS ENUM('cash', 'online')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'completed', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" double precision NOT NULL, "method" "public"."payment_method_enum" NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, "orderId" integer, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_image" ("id" SERIAL NOT NULL, "imageUrl" character varying NOT NULL, "description" character varying, "productId" integer, CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite" ("id" SERIAL NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "product_id" integer, CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "description" text NOT NULL, "rating" integer NOT NULL, "userId" integer, "productId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "composition" character varying, "description" character varying, "price" integer NOT NULL, "discount" integer, "quantityInStock" integer NOT NULL, "categoryId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "totalPrice" double precision NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "recipientName" character varying, "recipientPhone" character varying, "totalAmount" integer NOT NULL, "bonusPointsUsed" integer NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive', 'blocked')`);
        await queryRunner.query(`CREATE TYPE "public"."user_type_enum" AS ENUM('user', 'admin', 'florist')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "middleName" character varying, "phone" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "bonusPoints" integer NOT NULL DEFAULT '0', "bonusCardLevel" integer NOT NULL DEFAULT '2', "totalOrders" integer NOT NULL DEFAULT '0', "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', "type" "public"."user_type_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_time_slot" ("id" SERIAL NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f30ed33b39da13a29c9ea0ee74c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_schedule_dayofweek_enum" AS ENUM('Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье')`);
        await queryRunner.query(`CREATE TABLE "delivery_schedule" ("id" SERIAL NOT NULL, "dayOfWeek" "public"."delivery_schedule_dayofweek_enum", "specificDate" date, "isActive" boolean NOT NULL DEFAULT true, "timeSlotId" integer, CONSTRAINT "PK_97a65f0c2ee99c7e28984c45352" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_type_enum" AS ENUM('address', 'pickup')`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_enum" AS ENUM('pending', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "delivery" ("id" SERIAL NOT NULL, "type" "public"."delivery_type_enum" NOT NULL DEFAULT 'address', "address" character varying, "pickupPoint" character varying, "recipientName" character varying, "recipientLastName" character varying, "comments" text, "deliveryTime" TIMESTAMP, "status" "public"."delivery_status_enum" NOT NULL DEFAULT 'pending', "senderId" integer, "orderId" integer, CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_available_schedules_delivery_schedule" ("deliveryId" integer NOT NULL, "deliveryScheduleId" integer NOT NULL, CONSTRAINT "PK_f70c58e5d26b0bc235f69547fff" PRIMARY KEY ("deliveryId", "deliveryScheduleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c882694dda26d8ba7413d9fd6f" ON "delivery_available_schedules_delivery_schedule" ("deliveryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_712a5c6451d820cf6e494d5a86" ON "delivery_available_schedules_delivery_schedule" ("deliveryScheduleId") `);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_b3e2e24d544d819cae3679b4084" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_schedule" ADD CONSTRAINT "FK_81977d1004f23c08a3894906a51" FOREIGN KEY ("timeSlotId") REFERENCES "delivery_time_slot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_ec9bde66252a7a917396f9f362d" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_b37d51328f9ca210b573b19372c" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_available_schedules_delivery_schedule" ADD CONSTRAINT "FK_c882694dda26d8ba7413d9fd6fe" FOREIGN KEY ("deliveryId") REFERENCES "delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "delivery_available_schedules_delivery_schedule" ADD CONSTRAINT "FK_712a5c6451d820cf6e494d5a867" FOREIGN KEY ("deliveryScheduleId") REFERENCES "delivery_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_available_schedules_delivery_schedule" DROP CONSTRAINT "FK_712a5c6451d820cf6e494d5a867"`);
        await queryRunner.query(`ALTER TABLE "delivery_available_schedules_delivery_schedule" DROP CONSTRAINT "FK_c882694dda26d8ba7413d9fd6fe"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_b37d51328f9ca210b573b19372c"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_ec9bde66252a7a917396f9f362d"`);
        await queryRunner.query(`ALTER TABLE "delivery_schedule" DROP CONSTRAINT "FK_81977d1004f23c08a3894906a51"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_b3e2e24d544d819cae3679b4084"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74"`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_712a5c6451d820cf6e494d5a86"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c882694dda26d8ba7413d9fd6f"`);
        await queryRunner.query(`DROP TABLE "delivery_available_schedules_delivery_schedule"`);
        await queryRunner.query(`DROP TABLE "delivery"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_type_enum"`);
        await queryRunner.query(`DROP TABLE "delivery_schedule"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_schedule_dayofweek_enum"`);
        await queryRunner.query(`DROP TABLE "delivery_time_slot"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`DROP TABLE "product_image"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
    }

}
