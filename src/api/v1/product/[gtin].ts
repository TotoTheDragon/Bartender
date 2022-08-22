import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { deleteProduct, getProduct, patchProduct } from '../../../models/v1/Product';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.get('/', async (req, res) => {
        const product = await getProduct(instance['db-manager'], (req.params as any).gtin);
        res.status(200).send(product);
    });

    instance.delete('/', async (req, res) => {
        const product = await deleteProduct(instance['db-manager'], (req.params as any).gtin);
        res.status(200).send(product);
    });

    instance.patch('/', async (req, res) => {
        const product = await patchProduct(
            instance['db-manager'],
            (req.params as any).gtin,
            req.body as any,
        );
        res.status(200).send(product);
    });

    done();
}) as FastifyPluginCallback;
