import db from './services/backend/db.js';

const listCategories = async () => {
    try {
        await db.sequelize.authenticate();
        const categories = await db.categories.findAll();
        console.log(`✅ Found ${categories.length} categories:`);
        categories.forEach(c => console.log(`- ${c.name} (Slug: ${c.slug})`));
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

listCategories();
