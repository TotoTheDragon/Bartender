import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import HealthManager from '../../../health/HealthManager';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.get('/', (_req, res) => {
        const healthManager = (instance as any)[
            'health-manager'
        ] as HealthManager;
        res.status(200).send(healthManager.getHealth());
    });

    done();
}) as FastifyPluginCallback;
