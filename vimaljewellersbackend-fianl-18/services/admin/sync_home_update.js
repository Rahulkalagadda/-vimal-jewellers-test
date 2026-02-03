
import dotenv from 'dotenv';
dotenv.config();
import db from './db.js';

const run = async () => {
    try {
        console.log('Syncing Home Related Tables...');
        await db.sectionImages.sync({ alter: true });
        await db.homeGifts.sync({ alter: true });
        await db.home.sync({ alter: true });
        console.log('✅ Home Tables Synced.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Sync Failed:', err);
        process.exit(1);
    }
};

run();
