import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import healthRouter from './health/health-router';
import productRouter from './product/product-router';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.register(healthRouter, { prefix: '/health' });
    instance.register(productRouter, { prefix: '/product' });

    done();
}) as FastifyPluginCallback;
