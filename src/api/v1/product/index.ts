import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
    checkRequiredCreateFields,
    createProduct,
} from '../../../models/v1/Product';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.get('/', (_req, res) => {
        res.status(200).send();
    });

    instance.post('/', async (req, res) => {
        const product: any = req.body;
        try {
            checkRequiredCreateFields(product);
        } catch (err: any) {
            return res.status(400).send({ status: 400, message: err.message });
        }

        try {
            const dbProduct = await createProduct(
                instance['db-manager'],
                product,
            );
            return res.status(201).send(dbProduct);
        } catch (err: any) {
            // Check if it is a unique_violation, which means it already exists
            if (err.code === '23505') {
                return res
                    .status(409)
                    .send({ status: 409, message: 'Product already exists' });
            }
            return res
                .status(500)
                .send({ status: 500, message: 'Server error' });
        }
    });

    done();
}) as FastifyPluginCallback;
