
const demoPages = [
    {
        title: "About Our Company",
        slug: "about-us",
        content: "<h1>About Vimal Jewellers</h1><p>Welcome to Vimal Jewellers, where tradition meets elegance. Established with a vision to provide exquisite jewelry that tells a story, we have been serving our cherished customers for decades.</p><p>Our craftsmanship is second to none, ensuring that every piece you purchase is a masterpiece. From timeless classics to contemporary designs, our collection caters to every taste and occasion.</p>",
    },
    {
        title: "Terms and Conditions",
        slug: "terms-and-conditions",
        content: "<h1>Terms and Conditions</h1><p>Welcome to Vimal Jewellers. These terms and conditions outline the rules and regulations for the use of our Website.</p><p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Vimal Jewellers if you do not agree to take all of the terms and conditions stated on this page.</p>",
    },
    {
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "<h1>Privacy Policy</h1><p>At Vimal Jewellers, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Vimal Jewellers and how we use it.</p><p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>",
    },
    {
        title: "FAQ",
        slug: "faq",
        content: "<h1>Frequently Asked Questions</h1><h2>1. How do I place an order?</h2><p>You can verify your secure order via our website. Select your favorite items, add them to your cart, and proceed to checkout.</p><h2>2. What payment methods do you accept?</h2><p>We accept all major credit cards, debit cards, net banking, and UPI.</p>",
    },
    {
        title: "Offers T&Cs",
        slug: "offers-terms",
        content: "<h1>Offers Terms & Conditions</h1><p>All offers are subject to availability. Vimal Jewellers reserves the right to withdraw or amend offers at any time without prior notice.</p><p>Offers cannot be combined with other promotions unless explicitly stated.</p>",
    },
    {
        title: "Sitemap",
        slug: "sitemap",
        content: "<h1>Sitemap</h1><ul><li><a href='/'>Home</a></li><li><a href='/shop'>Shop</a></li><li><a href='/pages/about-us'>About Us</a></li><li><a href='/pages/contact-us'>Contact Us</a></li></ul>",
    },
    {
        title: "Customer Reviews",
        slug: "reviews",
        content: "<h1>Customer Reviews</h1><p>See what our happy customers have to say about us!</p>",
    },
];

const seedPages = async (db) => {
    try {
        for (const page of demoPages) {
            await db.pages.findOrCreate({
                where: { slug: page.slug },
                defaults: page,
            });
        }
        console.log("✅ Pages seeded successfully");
    } catch (error) {
        console.error("❌ Error seeding pages:", error);
    }
};

export default seedPages;
