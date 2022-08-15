import fastify from 'fastify';
import BartenderRouter from './router';

const server = fastify();

server.register(BartenderRouter, { prefix: '/api' });

server.listen({ port: 3000 });
