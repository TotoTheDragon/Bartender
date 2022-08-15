import { config } from 'dotenv';
import fastify from 'fastify';
import winston from 'winston';
import DatabaseManager from './database/DatabaseManager';
import MemoryChecker from './health/checkers/MemoryChecker';
import HealthManager from './health/HealthManager';
import BartenderRouter from './router';

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

process.on('uncaughtException', (err) => {
    logger.error('Uncaught error occurred', { err });
});
/*
    Initialize all required things
*/

const healthManager = new HealthManager(logger);
const databaseManager = new DatabaseManager(logger, {});
const server = fastify();

// Set up fastify instance
server.decorate('logger', logger);
server.decorate('health-manager', healthManager);
server.decorate('db-manager', databaseManager);
server.register(BartenderRouter, { prefix: '/api' });

// Set up health manager
healthManager.registerDependency('Postgres Database', databaseManager);

healthManager.registerChecker(new MemoryChecker('Memory'));

// Set up connections
(async () => {
    databaseManager.connect();
})();

(async () => {
    const address = await server.listen({ port: 3000 });
    logger.info('API is now running', address);
})();
