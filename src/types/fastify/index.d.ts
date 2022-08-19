declare global {
    import { Logger } from 'winston';
    import Ajv from 'ajv';
    import HealthManager from '../../health/HealthManager';
    import DatabaseManager from '../../database/DatabaseManager';

    module 'fastify' {
        interface FastifyReply {
            responseTime: number;
            sendTime: number;
            startTime: number;
        }

        interface FastifyInstance {
            ajv: Ajv;
            logger: Logger;
            'health-manager': HealthManager;
            'db-manager': DatabaseManager;
        }
    }
}
