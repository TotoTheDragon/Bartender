import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import product from '.';
import search from './search';
import gtin from './[gtin]';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.register(product);
    instance.register(gtin, { prefix: '/:gtin' });
    instance.register(search, { prefix: '/search' });
    done();
}) as FastifyPluginCallback;
