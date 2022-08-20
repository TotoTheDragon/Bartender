import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { deleteProduct, getProduct } from '../../../models/v1/Product';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.get('/', async (req, res) => {
        const product = await getProduct(instance['db-manager'], (req.params as any).gtin);
        res.status(200).send(product);
    });

    instance.delete('/', async (req, res) => {
        const product = await deleteProduct(instance['db-manager'], (req.params as any).gtin);
        res.status(200).send(product);
    });

    done();
}) as FastifyPluginCallback;
