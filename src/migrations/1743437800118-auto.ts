import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1743437800118 implements MigrationInterface {
    name = 'Auto1743437800118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" ADD "totalPrice" double precision`);

        await queryRunner.query(`
            UPDATE "order_item"
            SET "totalPrice" = "quantity" * (SELECT "price" FROM "product" WHERE "product"."id" = "order_item"."productId")
        `);

        await queryRunner.query(`ALTER TABLE "order_item" ALTER COLUMN "totalPrice" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "totalPrice"`);
    }
}
