import db from './services/backend/db.js';
import 'dotenv/config';

const { sequelize } = db;

async function syncCharges() {
    try {
        console.log('Syncing makingCharges column...');
        await sequelize.query(`
      ALTER TABLE products
      ADD COLUMN makingCharges FLOAT DEFAULT 0;
    `);
        console.log('Successfully added makingCharges column.');
    } catch (error) {
        if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
            console.log('Column makingCharges already exists.');
        } else {
            console.error('Error syncing charges:', error);
        }
    } finally {
        process.exit();
    }
}

syncCharges();
