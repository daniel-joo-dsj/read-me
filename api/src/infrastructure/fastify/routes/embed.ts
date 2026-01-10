import { Chunkifier } from '@application/chunkifier.js'
import { Embedder } from '@application/embedder.js'
import fs from 'fs/promises';
import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import type { FilenameParams } from '@domain/files/filename-params.js';

//todo refactor: separate business logic
async function embed (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/embed/:filename', async (request : FastifyRequest<{Params : FilenameParams}>, reply: FastifyReply) => {
        try {
            const files = await fs.readdir(options.path)

            // Check if file exists in ../uploads directory
            if (!files.includes(request.params.filename)) {
                return reply.code(400).send('File does not exist')
            }

            // Create chunks
            const filepath = options.path + request.params.filename
            const chunkifier = new Chunkifier(filepath)
            const chunks = await chunkifier.chunkify()

            // Embed chunks
            const embedder = new Embedder();
            await embedder.embedChunks(chunks);
            reply.send({ message: 'Embedded chunks successfully'})
        } catch (err) {
            console.error('Error occurred while embedding chunks ', err)
        }
    })
}

export default embed;