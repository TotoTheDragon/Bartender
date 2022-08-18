import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { getProduct } from '../../../models/v1/Product';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.get('/', async (req, res) => {
        const product = await getProduct(
            instance['db-manager'],
            (req.params as any).gtin,
        );
        res.status(200).send(product);
    });

    done();
}) as FastifyPluginCallback;
