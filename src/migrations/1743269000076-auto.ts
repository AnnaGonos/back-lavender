import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1743269000076 implements MigrationInterface {
    name = 'Auto1743269000076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('created', 'confirmed', 'assembled', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "status" "public"."order_status_enum" NOT NULL DEFAULT 'created'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    }

}
