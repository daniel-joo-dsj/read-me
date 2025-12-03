import { Chunkifier } from '../services/chunkifier.js'
import fs from 'fs/promises';
import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import type { FilenameParams } from '../types/filename.js';

async function createChunks (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/create-chunks/:filename', async (request : FastifyRequest<{Params : FilenameParams}>, reply: FastifyReply) => {
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
            reply.send({ message: 'Created chunks successfully', chunks })
        } catch (err) {
            console.error('Error occurred while creating chunks ', err)
        }
    })
}

export default createChunks;