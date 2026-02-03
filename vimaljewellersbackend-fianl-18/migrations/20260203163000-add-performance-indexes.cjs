'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add indexes to 'products' table
        await queryInterface.addIndex('products', ['slug'], { name: 'idx_products_slug' });
        await queryInterface.addIndex('products', ['categoryId'], { name: 'idx_products_category' });
        await queryInterface.addIndex('products', ['collectionId'], { name: 'idx_products_collection' });

        // Add index to 'categories' table
        await queryInterface.addIndex('categories', ['slug'], { name: 'idx_categories_slug' });

        // Add index to 'orders' table
        await queryInterface.addIndex('orders', ['userId'], { name: 'idx_orders_user' });

        // Add index to 'wishlist' table
        await queryInterface.addIndex('wishlist', ['userId'], { name: 'idx_wishlist_user' });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('products', 'idx_products_slug');
        await queryInterface.removeIndex('products', 'idx_products_category');
        await queryInterface.removeIndex('products', 'idx_products_collection');
        await queryInterface.removeIndex('categories', 'idx_categories_slug');
        await queryInterface.removeIndex('orders', 'idx_orders_user');
        await queryInterface.removeIndex('wishlist', 'idx_wishlist_user');
    }
};
