// @ts-nocheck
const logger = require('./logger');
const config = require('./config');
const jwt = require('jsonwebtoken');
const requestLogger = (request, response, next) => {
    logger.info('---');
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
};
const unknownEndpoint = (request, response) => {
    response.status(404).send({ message: 'Unknown Endpoint!' });
};
const generateApiOutput = (type, message) => {
    return {
        status: type,
        response: message
    };
};
const authBarrier = (request, response, next) => {
    try {
        let token;
        const authorization = request.get('authorization');
        if (authorization && authorization.toLowerCase().startsWith('bearer '))
            token = authorization.substring(7);
        const tokenData = jwt.verify(token, config.SECRET);
        request.userID = tokenData.userID;
        next();
    }
    catch (error) {
        return response.status(400).json(generateApiOutput("FAILED", "Authentication Failed!"));
    }
};
module.exports = {
    requestLogger,
    unknownEndpoint,
    generateApiOutput,
    authBarrier
};
