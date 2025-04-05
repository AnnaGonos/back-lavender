import { getConnection } from 'typeorm';
import AppDataSource from "../typeorm.config";

async function cleanDatabase() {
    try {
        // Инициализация подключения к базе данных
        await AppDataSource.initialize();
        console.log('Data source has been initialized');

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        try {
            // Проверка таблицы
            const tables = await queryRunner.query(
                `SELECT * FROM information_schema.tables WHERE table_name = 'delivery_time_slot'`,
            );
            console.log('Tables:', tables);

            // Проверка последовательности
            const sequences = await queryRunner.query(
                `SELECT * FROM pg_sequences WHERE sequencename = 'delivery_time_slot_id_seq'`,
            );
            console.log('Sequences:', sequences);

            // Удаление таблицы
            await queryRunner.query(`DROP TABLE IF EXISTS delivery_time_slot`);

            // Удаление последовательности
            await queryRunner.query(`DROP SEQUENCE IF EXISTS delivery_time_slot_id_seq`);

            console.log('Database cleaned successfully.');
        } catch (error) {
            console.error('Error during database cleanup:', error);
        } finally {
            await queryRunner.release();
        }
    } catch (error) {
        console.error('Error initializing data source:', error);
    } finally {
        // Закрытие подключения к базе данных
        await AppDataSource.destroy();
    }
}

// Запуск функции
cleanDatabase();