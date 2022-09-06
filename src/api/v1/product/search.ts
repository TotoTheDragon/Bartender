import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import DatabaseManager from '../../../database/DatabaseManager';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.post('/', async (req, res) => {
        const manager: DatabaseManager = instance['db-manager'];
        const products = await manager.query(
            'SELECT gtin, word_similarity(search, $1) FROM product_search ORDER BY word_similarity(search, $1) DESC LIMIT 10;',
            [(req as any).body.name],
        );
        // TODO also search by things other than name, like brand, category and quantity
        // TODO lookup actual product and return their actual data
        res.status(200).send(products);
    });

    done();
}) as FastifyPluginCallback;
