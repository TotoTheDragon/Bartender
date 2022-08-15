import { FastifyInstance, FastifyPluginCallback } from 'fastify';

export default ((instance: FastifyInstance, _opts, done) => {
    instance.get('/', (_req, res) => {
        res.status(200).send(instance['health-manager'].getHealth());
    });

    done();
}) as FastifyPluginCallback;
