import express from "express";
const router = express.Router();
import db from "../db.js";
import { Op } from "sequelize";

// GET /api/categories - List all categories
router.get("/", async (req, res) => {
  try {
    const categories = await db.categories.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/categories/:slug - Get category details and products
router.get("/:slug", async (req, res) => {
  try {
    const category = await db.categories.findOne({ where: { slug: req.params.slug } });
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Find banner for this category (by url)
    let banner = await db.banners.findOne({ where: { url: `/category/${category.slug}` } });
    let bannerImage = banner ? banner.image : null;

    // Attach banner to category object
    const categoryWithBanner = { ...category.dataValues, banner: bannerImage };

    // Build filter conditions (only price in SQL, others in JS)
    const where = { categoryId: category.id };

    // Price filter
    if (req.query.price) {
      // price=under-5000,5000-10000,above-20000
      const priceFilters = req.query.price.split(',');
      const priceConditions = [];
      priceFilters.forEach((range) => {
        if (range === 'under-5000') priceConditions.push({ price: { [Op.lt]: 5000 } });
        if (range === '5000-10000') priceConditions.push({ price: { [Op.gte]: 5000, [Op.lte]: 10000 } });
        if (range === '10000-20000') priceConditions.push({ price: { [Op.gte]: 10000, [Op.lte]: 20000 } });
        if (range === 'above-20000') priceConditions.push({ price: { [Op.gt]: 20000 } });
      });
      if (priceConditions.length > 0) {
        where[Op.or] = priceConditions;
      }
    }

    // Custom Price Range (from Shop For)
    if (req.query.minPrice || req.query.maxPrice) {
      const priceCondition = {};
      if (req.query.minPrice) priceCondition[Op.gte] = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) priceCondition[Op.lte] = parseFloat(req.query.maxPrice);

      // Combine with existing price conditions if any (AND logic)
      if (where.price) {
        where.price = { [Op.and]: [where.price, priceCondition] };
      } else {
        where.price = priceCondition;
      }
    }

    let products = await db.products.findAll({
      where,
      include: [
        {
          model: db.materials,
          as: "materials",
          through: { attributes: [] }
        },
        {
          model: db.globalMaterials,
          as: "globalMaterials",
          through: { attributes: [] }
        }
      ]
    });

    // Parse images field for each product and transform to {src, alt} format
    products = products.map(product => {
      let images = product.images;
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch (e) {
          images = [];
        }
      }

      // Transform to {src, alt} format
      if (Array.isArray(images)) {
        images = images.map(img => {
          if (typeof img === 'string') {
            return { src: img, alt: product.name || "Product Image" };
          }
          return {
            src: img.src || img || "/placeholder.jpg",
            alt: img.alt || product.name || "Product Image"
          };
        });
      }

      return { ...product.dataValues, images };
    });

    // Material/style filter in JS
    if (req.query.material || req.query.style) {
      products = products.filter((product) => {
        let match = true;
        if (req.query.material) {
          const materialFilters = req.query.material.split(',').map((m) => m.toLowerCase());

          // Check new Many-to-Many materials relationship
          const productMaterials = product.materials || [];
          const globalMaterials = product.globalMaterials || [];

          const hasMaterialMatch = productMaterials.some(m => materialFilters.includes(m.name.toLowerCase()));
          const hasGlobalMatch = globalMaterials.some(m => materialFilters.includes(m.name.toLowerCase()));

          // Also check legacy productDetails for backward compatibility if needed, or just rely on new relation
          const legacyMaterial = product.productDetails?.material || product.material;
          const hasLegacyMatch = legacyMaterial && materialFilters.includes(legacyMaterial.toLowerCase());

          if (!hasMaterialMatch && !hasLegacyMatch && !hasGlobalMatch) {
            match = false;
          }
        }
        if (req.query.style) {
          const styleFilters = req.query.style.split(',').map((s) => s.toLowerCase());
          const prodStyle = product.productDetails?.style || product.style;
          if (prodStyle) {
            match = match && styleFilters.includes(prodStyle.toLowerCase());
          } else {
            match = false;
          }
        }
        if (req.query.occasion) {
          const occasionFilters = req.query.occasion.split(',').map((o) => o.toLowerCase());
          const prodOccasion = product.productDetails?.occasion || product.occasion; // Check both legacy and direct if exists
          // Also check if occasion is in a 'occasions' relation if it exists, similar to materials
          // For now assuming it's in productDetails or a direct field

          let hasOccasionMatch = false;
          if (prodOccasion) {
            hasOccasionMatch = occasionFilters.includes(prodOccasion.toLowerCase());
          }

          // If not found in simple fields, check if it might be an array in productDetails
          if (!hasOccasionMatch && product.productDetails?.occasions && Array.isArray(product.productDetails.occasions)) {
            hasOccasionMatch = product.productDetails.occasions.some(occ => occasionFilters.includes(occ.toLowerCase()));
          }

          if (!hasOccasionMatch) {
            match = false;
          }
        }
        return match;
      });
    }

    res.json({ category: categoryWithBanner, products });
  } catch (error) {
    console.error(`Error fetching category ${req.params.slug}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
