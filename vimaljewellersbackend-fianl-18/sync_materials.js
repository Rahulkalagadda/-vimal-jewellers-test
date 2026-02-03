
const syncMaterials = async () => {
    try {
        // Force correct credentials before importing db
        process.env.DATABASE_USER = 'root'; // Adjust if needed based on environment
        process.env.DATABASE_PASSWORD = 'vipin@123';
        process.env.DATABASE_NAME = 'vimaljewellers';

        const { default: createDb } = await import('./modules/config/db_helper.js');
        const db = createDb();
        console.log('✅ Database module loaded.');

        await db.sequelize.authenticate();
        console.log('✅ Database connected.');

        // Sync specific models to trigger association sync if possible
        await db.materials.sync({ alter: true });
        await db.products.sync({ alter: true });

        // Fallback: Run raw query to ensure table exists
        await db.sequelize.query(`
            CREATE TABLE IF NOT EXISTS product_materials (
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                productId INTEGER NOT NULL,
                materialId INTEGER NOT NULL,
                PRIMARY KEY (productId, materialId),
                FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (materialId) REFERENCES materials(id) ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);
        console.log('✅ product_materials table ensured via raw query.');

        console.log('✅ Models synced.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

syncMaterials();
