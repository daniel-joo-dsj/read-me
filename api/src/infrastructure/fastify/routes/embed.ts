import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import type { FilenameParams } from '@domain/files/filename-params.js';


async function embed (fastify: FastifyInstance, options: FastifyPluginOptions) {
    const { embeddingsAdapter } = options;
    
    fastify.get('/embed/:filename', async (request : FastifyRequest<{Params : FilenameParams}>, reply: FastifyReply) => {
        embeddingsAdapter.embed(request);
        reply.send({ message: 'Embedded chunks successfully'})
    })
}

export default embed;