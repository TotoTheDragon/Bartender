import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import health from '.';
import healthReady from './ready';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.register(health);
    instance.register(healthReady, { prefix: '/ready' });

    done();
}) as FastifyPluginCallback;
