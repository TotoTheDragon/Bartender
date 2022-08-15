import { config } from 'dotenv';
import fastify from 'fastify';
import winston from 'winston';
import DatabaseManager from './database/DatabaseManager';
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

const healthManager = new HealthManager();
const databaseManager = new DatabaseManager({});
const server = fastify();

// Set up fastify instance
server.decorate('logger', logger);
server.decorate('health-manager', healthManager);
server.decorate('db-manager', databaseManager);
server.register(BartenderRouter, { prefix: '/api' });

// Set up health manager
healthManager.registerDependency('Postgres Database', databaseManager);

// Set up connections
(async () => {
    databaseManager.connect();
})();

(async () => {
    const address = await server.listen({ port: 3000 });
    logger.info('API is now running', address);
})();
