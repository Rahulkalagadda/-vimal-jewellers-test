import db from './services/backend/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, 'services/backend/images');
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image'; // Or a local default

async function cleanBrokenImages() {
    try {
        console.log('🔍 Checking for broken images in database...');

        // 1. Check Products
        const products = await db.products.findAll();
        let brokenCount = 0;

        for (const product of products) {
            if (!product.images || product.images.length === 0) continue;

            let updatedImages = [];
            let changed = false;

            // Handle both array of strings or simple string (depending on your schema, usually JSON array in MySQL)
            const imagesList = Array.isArray(product.images) ? product.images : [product.images];

            for (const imgUrl of imagesList) {
                if (!imgUrl || typeof imgUrl !== 'string') continue;

                // Extract filename from URL (assuming standard storage format)
                // e.g. "https://backend.vimaljewellers.com/images/123.png" -> "123.png"
                const filename = imgUrl.split('/').pop();
                const filePath = path.join(IMAGES_DIR, filename);

                if (fs.existsSync(filePath)) {
                    updatedImages.push(imgUrl);
                } else {
                    console.log(`❌ Missing file for Product ${product.id}: ${filename}`);
                    changed = true;
                    brokenCount++;
                }
            }

            if (changed) {
                // Update DB
                // If all images broken, maybe set to [] or null?
                // AdminJS usually expects [] or null
                await product.update({ images: updatedImages });
                console.log(`✅ Updated Product ${product.id}: Removed broken links.`);
            }
        }

        console.log(`\n🎉 Done! Removed ${brokenCount} broken image references.`);

    } catch (error) {
        console.error('Error cleaning images:', error);
    } finally {
        process.exit();
    }
}

cleanBrokenImages();
