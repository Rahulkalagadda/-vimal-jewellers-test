
const auditMaterials = async () => {
    try {
        process.env.DATABASE_USER = 'root';
        process.env.DATABASE_PASSWORD = 'vipin@123';
        process.env.DATABASE_NAME = 'vimaljewellers';

        const { default: createDb } = await import('./modules/config/db_helper.js');
        const db = createDb();
        await db.sequelize.authenticate();

        const productId = 1008; // From screenshot
        console.log(`\n--- Auditing Product ${productId} ---`);

        const product = await db.products.findByPk(productId, {
            include: [
                {
                    model: db.materials,
                    as: 'materials',
                    through: { attributes: [] }
                }
            ]
        });

        if (!product) {
            console.log('❌ Product 1008 NOT FOUND provided ID.');
        } else {
            console.log(`Product: ${product.name}`);
            console.log(`Linked Materials Count: ${product.materials.length}`);
            if (product.materials.length > 0) {
                product.materials.forEach(m => console.log(` - [${m.id}] ${m.name}`));
            } else {
                console.log('⚠️ No materials linked in Database.');
            }
        }

        // Also check raw junction table just to be absolutely sure
        const rawLinks = await db.sequelize.query(
            'SELECT * FROM product_materials WHERE productId = :pid',
            {
                replacements: { pid: productId },
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        console.log(`\nRaw Junction Table Rows (product_materials): ${rawLinks.length}`);
        rawLinks.forEach(row => console.log(JSON.stringify(row)));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

auditMaterials();
