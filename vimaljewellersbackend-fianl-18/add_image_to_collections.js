import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function addColumns() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'vipin@123',
        database: process.env.DATABASE_NAME || 'vimaljewellers',
    });

    try {
        console.log('Connected to database.');

        // Check if image column exists
        const [imageColumns] = await connection.execute(
            "SHOW COLUMNS FROM collections LIKE 'image'"
        );

        if (imageColumns.length > 0) {
            console.log('Column image already exists.');
        } else {
            console.log('Adding column image...');
            await connection.execute(
                "ALTER TABLE collections ADD COLUMN image VARCHAR(255)"
            );
            console.log('Column image added successfully.');
        }

        // Check if active column exists
        const [activeColumns] = await connection.execute(
            "SHOW COLUMNS FROM collections LIKE 'active'"
        );

        if (activeColumns.length > 0) {
            console.log('Column active already exists.');
        } else {
            console.log('Adding column active...');
            await connection.execute(
                "ALTER TABLE collections ADD COLUMN active BOOLEAN DEFAULT true"
            );
            console.log('Column active added successfully.');
        }

    } catch (error) {
        console.error('Error adding columns:', error);
    } finally {
        await connection.end();
    }
}

addColumns();
