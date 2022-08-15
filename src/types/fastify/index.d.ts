declare global {
    module 'fastify' {
        interface FastifyReply {
            responseTime: number;
            sendTime: number;
            startTime: number;
        }
    }
}
