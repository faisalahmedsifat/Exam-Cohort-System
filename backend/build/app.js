// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Express, CORS
const express = require('express');
const cors = require('cors');
// Express Instance
const app = express();
// Sequelize 
const { sequelize } = require('./models');
// Utils
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
// Routes
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
/**
 * Database Connection
 *
 * Using ORM: Sequelize
 */
const connectDB = () => __awaiter(this, void 0, void 0, function* () {
    try {
        logger.info('Connecting to Database...');
        yield sequelize.authenticate();
        logger.success('Connected to Database!');
    }
    catch (error) {
        logger.error('Failed to Connect to Database!', error.message);
    }
});
connectDB();
/**
 * Use all core packages
 *
 * CORS, Express, ExpressJSON
 */
app.use(cors());
app.use(express.static('build'));
app.use(express.json());
// Start Logging Requests in the console
// app.use(middleware.requestLogger)
/**
 * Use the Routes
 */
app.use('/', mainRoutes);
app.use('/api/user/', userRoutes);
/**
 * Handle the unknown endpoint, if no controller is defined for requested endpoint
 * Which is a 404 Error Code
 */
app.use(middleware.unknownEndpoint);
module.exports = app;
