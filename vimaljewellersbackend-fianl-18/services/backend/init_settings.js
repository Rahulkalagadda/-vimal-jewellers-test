
const seedSettings = async (db) => {
    try {
        const existing = await db.settings.findOne();
        if (!existing) {
            console.log('--- SEEDING SETTINGS ---');
            await db.settings.create({
                contactNumber: "+91 22 61066262",
                contactTiming: "(9am-7pm, 6 days a week)",
                supportEmail: "support@VIMALJEWELLERS.com",
                facebookLink: "https://facebook.com/vimaljewellers",
                instagramLink: "https://instagram.com/vimaljewellers",
                twitterLink: "https://twitter.com/vimaljewellers",
                youtubeLink: "https://youtube.com/vimaljewellers",
                pinterestLink: "https://pinterest.com/vimaljewellers",
                whatsappLink: "https://wa.me/912261066262"
            });
            console.log('--- SETTINGS SEEDED ---');
        }
    } catch (error) {
        console.error('Failed to seed settings:', error);
    }
};

export default seedSettings;
