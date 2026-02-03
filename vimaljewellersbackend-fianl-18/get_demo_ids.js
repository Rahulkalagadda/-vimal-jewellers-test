import db from './services/backend/db.js';

const getIds = async () => {
    try {
        await db.sequelize.authenticate();

        const category = await db.categories.findOne();
        const collection = await db.collections.findOne();

        console.log(`Category ID: ${category ? category.id : '1'} (${category ? category.name : 'Default'})`);
        console.log(`Collection ID: ${collection ? collection.id : '1'} (${collection ? collection.name : 'Default'})`);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

getIds();
