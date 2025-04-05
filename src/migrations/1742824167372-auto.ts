import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1742824167372 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Удалить старый столбец dayOfWeek (если он существует)
        await queryRunner.query(`ALTER TABLE "delivery_schedule" DROP COLUMN IF EXISTS "dayOfWeek"`);

        // 2. Удалить старый тип (если он существует)
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."delivery_schedule_dayofweek_enum"`);

        // 3. Создать новый тип
        await queryRunner.query(`
            CREATE TYPE "public"."delivery_schedule_dayofweek_enum" AS ENUM (
                'Понедельник',
                'Вторник',
                'Среда',
                'Четверг',
                'Пятница',
                'Суббота',
                'Воскресенье'
            )
        `);

        // 4. Добавить новый столбец dayOfWeek
        await queryRunner.query(`
            ALTER TABLE "delivery_schedule"
                ADD "dayOfWeek" "public"."delivery_schedule_dayofweek_enum"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Откат изменений
        await queryRunner.query(`ALTER TABLE "delivery_schedule" DROP COLUMN IF EXISTS "dayOfWeek"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."delivery_schedule_dayofweek_enum"`);
    }
}
