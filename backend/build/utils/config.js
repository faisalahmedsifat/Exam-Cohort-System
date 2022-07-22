// @ts-nocheck
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET;
module.exports = {
    PORT, SECRET,
    "development": {
        "username": process.env.DB_DEV_USERNAME,
        "password": process.env.DB_DEV_PASSWORD,
        "database": process.env.DB_DEV_DATABASE,
        "host": process.env.DB_DEV_HOST,
        "dialect": process.env.DB_DEV_DIALECT
    },
    "test": {
        "username": process.env.DB_TEST_USERNAME,
        "password": process.env.DB_TEST_PASSWORD,
        "database": process.env.DB_TEST_DATABASE,
        "host": process.env.DB_TEST_HOST,
        "dialect": process.env.DB_TEST_DIALECT
    },
    "production": {
        "username": process.env.DB_PROD_USERNAME,
        "password": process.env.DB_PROD_PASSWORD,
        "database": process.env.DB_PROD_DATABASE,
        "host": process.env.DB_PROD_HOST,
        "dialect": process.env.DB_PROD_DIALECT,
        dialectOptions: {
            ssl: {
                require: 'true',
                rejectUnauthorized: false
            }
        }
    }
};
