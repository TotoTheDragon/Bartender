import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { checkRequiredCreateFields, createProduct } from '../../../models/v1/Product';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.get('/', (_req, res) => {
        res.status(200).send();
    });

    instance.post('/', async (req, res) => {
        const data: any = req.body;
        try {
            checkRequiredCreateFields(data);
        } catch (err: any) {
            return res.status(400).send({ status: 400, message: err.message });
        }

        try {
            const product = await createProduct(instance['db-manager'], data);
            return res.status(201).send(product);
        } catch (err: any) {
            switch (err.code) {
            case '23505': // unique_violation -> was not able to create because there already exists an entry
                return res.status(409).send({ status: 409, message: 'Product already exists' });
            default:
                return res.status(500).send({ status: 500, message: 'Server error' });
            }
        }
    });

    done();
}) as FastifyPluginCallback;
