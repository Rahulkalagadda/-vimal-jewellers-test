
import db from './services/backend/db.js';

async function fixModernConfig() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const homeData = await db.home.findOne();
        if (!homeData) {
            console.log("Home data not found");
            return;
        }

        // Existing files found in earlier step:
        // 1767970677044.jpeg
        // 1767970334479.png
        // 1767970351986.png

        // Construct local URLs. 
        // We use relative paths so the backend helper can prepend the configured URL.
        // Or we use absolute localhost URLs to be safe and bypass helper logic issues.
        // Let's use absolute localhost URLs to be 100% sure for this debug session.

        const newConfig = {
            ...homeData.modernSectionConfig,
            largeImage: "http://localhost:7502/images/1767970677044.jpeg",
            smallImage1: "http://localhost:7502/images/1767970334479.png",
            smallImage2: "http://localhost:7502/images/1767970351986.png",

            // Keep titles/links if they exist, or provide defaults
            largeTitle: homeData.modernSectionConfig?.largeTitle || "Grand Hotel",
            largeLink: homeData.modernSectionConfig?.largeLink || "/collections/grand-hotel",
            smallTitle1: homeData.modernSectionConfig?.smallTitle1 || "Luxury Collection",
            smallLink1: homeData.modernSectionConfig?.smallLink1 || "/collections/luxury",
            smallTitle2: homeData.modernSectionConfig?.smallTitle2 || "Modern Art",
            smallLink2: homeData.modernSectionConfig?.smallLink2 || "/collections/modern"
        };

        homeData.modernSectionConfig = newConfig;
        // We also need to update this field specifically because Sequelize JSON updates can be tricky
        homeData.changed('modernSectionConfig', true);

        await homeData.save();
        console.log("Successfully updated modernSectionConfig with valid local images.");
        console.log(JSON.stringify(homeData.modernSectionConfig, null, 2));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await db.sequelize.close();
    }
}

fixModernConfig();
