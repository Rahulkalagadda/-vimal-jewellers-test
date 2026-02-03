import express from "express";
const router = express.Router();
import db from "../db.js";
import { transformImageUrl } from "../utils/imageHelper.js";

// GET /api/home - Get home page data
router.get("/", async (req, res) => {
  try {
    const bannersRaw = await db.banners.findAll({ where: { active: true } });
    const banners = bannersRaw.map(b => ({ ...b.toJSON(), image: transformImageUrl(b.image) }));

    const subBannersRaw = await db.subBanners.findAll({ where: { active: true } });
    const subBanners = subBannersRaw.map(b => ({ ...b.toJSON(), image: transformImageUrl(b.image) }));

    const categoriesRaw = await db.categories.findAll();
    const categories = categoriesRaw.map(c => ({ ...c.toJSON(), image: transformImageUrl(c.image) }));

    const collections = await db.collections.findAll();

    const sectionImagesRaw = await db.sectionImages.findAll();
    const sectionImages = sectionImagesRaw.map(s => ({ ...s.toJSON(), image: transformImageUrl(s.image) }));

    const gifts = await db.homeGifts.findAll();

    const videosRaw = await db.videos.findAll({ where: { active: true } });
    const videos = videosRaw.map(v => {
      const vid = v.toJSON();
      if (vid.videoFile) {
        vid.videoFile = transformImageUrl(vid.videoFile);
      }
      return vid;
    });

    const homeDataRaw = await db.home.findOne();
    const homeData = homeDataRaw ? {
      ...homeDataRaw.toJSON(),
      otherBannerImage: transformImageUrl(homeDataRaw.otherBannerImage),
      giftSectionBg: transformImageUrl(homeDataRaw.giftSectionBg),
      storeSectionBg: transformImageUrl(homeDataRaw.storeSectionBg)
    } : null;

    res.json({
      banners,
      subBanners,
      categories,
      collections,
      sectionImages,
      gifts,
      videos,
      homeData
    });
  } catch (error) {
    console.error("Error fetching home data:", error);
    res.status(500).json({ message: "Error fetching home data" });
  }
});

export default router;
