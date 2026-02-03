
import dotenv from 'dotenv';
dotenv.config();
import db from './db.js';

const run = async () => {
    try {
        console.log('Syncing GlobalMaterials...');
        await db.globalMaterials.sync({ alter: true });
        console.log('Syncing ProductGlobalMaterials...');
        await db.productGlobalMaterials.sync({ alter: true });
        console.log('Syncing Products...');
        await db.products.sync({ alter: true });
        console.log('Syncing Orders...');
        await db.orders.sync({ alter: true });
        console.log('Syncing Home...');
        await db.home.sync({ alter: true });
        console.log('✅ Specific Tables Synced.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Sync Failed:', err);
        process.exit(1);
    }
};

run();
