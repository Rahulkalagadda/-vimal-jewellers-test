
const mergeMaterials = async () => {
    try {
        process.env.DATABASE_USER = 'root';
        process.env.DATABASE_PASSWORD = 'vipin@123';
        process.env.DATABASE_NAME = 'vimaljewellers';

        const { default: createDb } = await import('./modules/config/db_helper.js');
        const db = createDb();
        await db.sequelize.authenticate();

        // 1. Get all materials
        const materials = await db.materials.findAll();

        // 2. Group by normalized name
        const groups = {};
        materials.forEach(m => {
            const name = m.name.trim().toUpperCase();
            if (!groups[name]) groups[name] = [];
            groups[name].push(m);
        });

        // 3. Process groups
        for (const name of Object.keys(groups)) {
            const list = groups[name];
            if (list.length > 1) {
                console.log(`\nProcessing duplicates for "${name}" (${list.length} records)...`);

                // Sort by ID, keep the one with lowest ID (or specific logic)
                // If any has specific 'Gold' mega category (e.g. ID 4 mentioned in logs), we might prefer that?
                // For now, let's keep the one with the lowest ID.
                list.sort((a, b) => a.id - b.id);

                const primary = list[0];
                const others = list.slice(1);

                console.log(`Keeping Primary: ID ${primary.id} (MegaCat: ${primary.megaCategoryId})`);

                for (const other of others) {
                    console.log(`  Merging ID ${other.id} (MegaCat: ${other.megaCategoryId})...`);

                    // Update Product Links
                    // Find all product links for 'other'
                    const links = await db.productMaterials.findAll({
                        where: { materialId: other.id }
                    });

                    for (const link of links) {
                        try {
                            // Try to update to primary
                            // This might fail if the product is ALREADY linked to primary (PK collision)
                            await db.productMaterials.update(
                                { materialId: primary.id },
                                { where: { productId: link.productId, materialId: other.id } }
                            );
                        } catch (err) {
                            // If update failed (likely duplicate entry), just delete the old link
                            // because the product is already linked to primary.
                            await link.destroy();
                        }
                    }

                    // Delete the duplicate material
                    await other.destroy({ force: true }); // Hard delete to clear valid name space
                }
                console.log(`  Merged ${others.length} records into ID ${primary.id}.`);
            }
        }

        console.log('\n✅ Merge complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

mergeMaterials();
