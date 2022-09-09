import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { searchProduct } from '../../../models/v1/Product';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.post('/', async (req, res) => {
        const products = await searchProduct(instance['db-manager'], req.body as any);
        res.status(200).send(products);
    });

    done();
}) as FastifyPluginCallback;
