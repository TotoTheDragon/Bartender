import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import v1Router from './api/v1/v1-router';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.register(v1Router, { prefix: '/v1' });
    done();
}) as FastifyPluginCallback;
