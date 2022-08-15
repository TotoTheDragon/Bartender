declare global {
    import { Logger } from 'winston';
    import HealthManager from '../../health/HealthManager';
    import DatabaseManager from '../../database/DatabaseManager';

    module 'fastify' {
        interface FastifyReply {
            responseTime: number;
            sendTime: number;
            startTime: number;
        }

        interface FastifyInstance {
            logger: Logger;
            'health-manager': HealthManager;
            'db-manager': DatabaseManager;
        }
    }
}
