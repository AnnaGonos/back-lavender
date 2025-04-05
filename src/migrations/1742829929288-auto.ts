import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1742829929288 implements MigrationInterface {
    name = 'Auto1742829929288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."delivery_schedule_dayofweek_enum" AS ENUM('Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье')`);
        await queryRunner.query(`ALTER TABLE "delivery_schedule" ADD "dayOfWeek" "public"."delivery_schedule_dayofweek_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery_schedule" ALTER COLUMN "specificDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_schedule" ALTER COLUMN "specificDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery_schedule" DROP COLUMN "dayOfWeek"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_schedule_dayofweek_enum"`);
    }

}
