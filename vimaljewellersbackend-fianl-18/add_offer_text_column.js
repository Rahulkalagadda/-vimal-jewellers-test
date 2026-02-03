import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function addColumn() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'vipin@123',
        database: process.env.DATABASE_NAME || 'vimaljewellers',
    });

    try {
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await connection.execute(
            "SHOW COLUMNS FROM products LIKE 'offerText'"
        );

        if (columns.length > 0) {
            console.log('Column offerText already exists.');
        } else {
            console.log('Adding column offerText...');
            await connection.execute(
                "ALTER TABLE products ADD COLUMN offerText VARCHAR(255) AFTER discount"
            );
            console.log('Column offerText added successfully.');
        }

    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        await connection.end();
    }
}

addColumn();
