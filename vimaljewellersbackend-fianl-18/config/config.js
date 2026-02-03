

import dotenv from 'dotenv';
dotenv.config();

export default {
    development: {
        username: process.env.DATABASE_USER || "vimal",
        password: process.env.DATABASE_PASSWORD || "vimal@123",
        database: process.env.DATABASE_NAME || "vimaljewellers",
        host: process.env.DATABASE_HOST || "127.0.0.1",
        port: process.env.DATABASE_PORT || 3306,
        dialect: "mysql",
        dialectOptions: {
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
        }
    },
    test: {
        username: process.env.DATABASE_USER || "vimal",
        password: process.env.DATABASE_PASSWORD || "vimal@123",
        database: process.env.DATABASE_NAME || "vimal_test",
        host: process.env.DATABASE_HOST || "127.0.0.1",
        dialect: "mysql"
    },

    production: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 3306,
        dialect: "mysql",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            connectTimeout: 10000
        },
        pool: {
            max: 50,
            min: 10,
            acquire: 30000,
            idle: 20000,
            evict: 10000
        },
        logging: false,
        retry: {
            max: 3
        }
    }
};
