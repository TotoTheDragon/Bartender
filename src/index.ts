import { config } from 'dotenv';
import fastify from 'fastify';
import DatabaseManager from './database/DatabaseManager';
import HealthManager from './health/HealthManager';
import BartenderRouter from './router';

config();
// Load all required things
const healthManager = new HealthManager();
const databaseManager = new DatabaseManager({});
const server = fastify();
// Set up fastify instance
server.register(BartenderRouter, { prefix: '/api' });
server.decorate('health-manager', healthManager);
server.decorate('db-manager', databaseManager);

// Set up health manager
healthManager.registerDependency('Postgres Database', databaseManager);

// Set up connections
(async () => {
    databaseManager.connect();
})();

(async () => {
    const address = await server.listen({ port: 3000 });
    console.log(`Now running api at ${address}`);
})();
