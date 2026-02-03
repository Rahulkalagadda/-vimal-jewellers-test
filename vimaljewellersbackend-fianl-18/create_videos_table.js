import createDatabaseReference from "./modules/config/db_helper.js";

const db = createDatabaseReference();

const createTable = async () => {
    try {
        await db.videos.sync({ force: true }); // Using force: true to ensure clean creation
        console.log("Videos table created successfully!");
    } catch (error) {
        console.error("Error creating videos table:", error);
    } finally {
        process.exit();
    }
};

createTable();
