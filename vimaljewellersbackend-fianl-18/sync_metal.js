
import db from "./services/backend/db.js";

async function sync() {
    try {
        console.log("Syncing Products table to add metalRateId...");
        await db.products.sync({ alter: true });
        console.log("Sync complete.");
    } catch (e) {
        console.error("Sync failed:", e);
    } finally {
        process.exit();
    }
}

sync();
