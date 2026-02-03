
const footerData = [
  {
    title: "ABOUT US",
    priority: 4,
    active: true,
    links: [
      { label: "About Our Company", url: "/pages/about-us" },
      { label: "Terms and Conditions", url: "/pages/terms-and-conditions" },
      { label: "Privacy Policy", url: "/pages/privacy-policy" },
      { label: "FAQ", url: "/pages/faq" },
      { label: "Offers T&Cs", url: "/pages/offers-terms" },
      { label: "Customer Reviews", url: "/pages/reviews" },
      { label: "Sitemap", url: "/pages/sitemap" },
    ]
  },
  {
    title: "WHY VIMAL JEWELLERS?",
    priority: 3,
    active: true,
    links: [
      { label: "15-Day Returns", url: "#" },
      { label: "Cancel & Refund", url: "#" },
      { label: "Lifetime Exchange", url: "#" },
      { label: "DGRP", url: "#" },
      { label: "Certified Jewellery", url: "#" },
      { label: "VIMAL Wallet", url: "#" },
    ]
  },
  {
    title: "EXPERIENCE VIMAL JEWELLERS",
    priority: 2,
    active: true,
    links: [
      { label: "Refer And Earn", url: "#" },
      { label: "Lookbook", url: "#" },
      { label: "Stylery Blog", url: "#" },
      { label: "Video Gallery", url: "#" },
      { label: "Order Tracking", url: "#" },
      { label: "Virtual Try On", url: "#" },
    ]
  },
  {
    title: "JEWELLERY GUIDES",
    priority: 1,
    active: true,
    links: [
      { label: "Diamond Education", url: "#" },
      { label: "Gemstone Education", url: "#" },
      { label: "Metal Education", url: "#" },
      { label: "Size Guide", url: "#" },
      { label: "Gold Rate Guide", url: "#" },
      { label: "Jewellery Care", url: "#" },
    ]
  }
];

export default async function seedFooter(db) {
  try {
    const count = await db.footerConfigs.count();
    if (count === 0) {
      console.log("Seeding footer configurations...");
      await db.footerConfigs.bulkCreate(footerData);
      console.log("Footer configurations seeded successfully.");
    } else {
      console.log("Footer configurations already exist, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding footer configurations:", error);
  }
}
