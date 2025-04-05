import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1742857106334 implements MigrationInterface {
    name = 'Auto1742857106334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_b3e2e24d544d819cae3679b4084"`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_b3e2e24d544d819cae3679b4084" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_b3e2e24d544d819cae3679b4084"`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_b3e2e24d544d819cae3679b4084" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
