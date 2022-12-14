/* eslint-disable no-param-reassign */
import Ajv from 'ajv';
import { config } from 'dotenv';
import fastify from 'fastify';
import { isValid as isValidGTIN } from 'gtin';
import winston from 'winston';
import DatabaseManager from './database/DatabaseManager';
import MemoryChecker from './health/checkers/MemoryChecker';
import ResponseTimeChecker from './health/checkers/ResponseTimeChecker';
import HealthManager from './health/HealthManager';
import BartenderRouter from './router';
import registerDatabaseTransformations from './transform/databaseTransformations';
import registerUtilityTransformations from './transform/utilityTransformations';
import Utils from './Utils';

config();
/*
    Set up logging
*/
const logger = winston.createLogger({});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}
/*
    Initialize all required things
*/

registerDatabaseTransformations();
registerUtilityTransformations();

const healthManager = new HealthManager(logger);
const databaseManager = new DatabaseManager(logger, {});
const memoryChecker = new MemoryChecker();
const responseTimeChecker = new ResponseTimeChecker();

const ajv = new Ajv();
ajv.addFormat('gtin', {
    type: 'string',
    validate: isValidGTIN,
});

const server = fastify();

// Set up fastify instance
server.decorate('logger', logger);
server.decorate('ajv', ajv);
server.decorate('health-manager', healthManager);
server.decorate('db-manager', databaseManager);
server.register(BartenderRouter, { prefix: '/api' });
server.addHook('onRequest', (_request, reply, next) => {
    reply.startTime = Utils.now();
    next();
});
server.addHook('onResponse', (_request, reply, next) => {
    reply.sendTime = Utils.now();
    reply.responseTime = reply.sendTime - reply.startTime;
    responseTimeChecker.addResponseTime(reply.responseTime);
    next();
});

// Set up connections
(async () => {
    databaseManager.connect();
})();

// Set up health manager
healthManager.registerDependency('Postgres Database', databaseManager);

healthManager.registerChecker(memoryChecker);
healthManager.registerChecker(responseTimeChecker, 5000);

(async () => {
    const address = await server.listen({ port: 3000 });
    logger.info('API is now running', address);
})();
