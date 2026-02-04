import db from './services/backend/db.js';

async function countData() {
    try {
        await db.sequelize.authenticate();
        const p = await db.products.count();
        const c = await db.categories.count();
        const u = await db.users.count();
        const o = await db.orders.count();

        console.log(`\n📊 DATABASE STATUS:`);
        console.log(`Products:   ${p}`);
        console.log(`Categories: ${c}`);
        console.log(`Users:      ${u}`);
        console.log(`Orders:     ${o}`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
countData();
