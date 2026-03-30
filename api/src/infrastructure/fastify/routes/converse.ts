import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'


async function converse (fastify: FastifyInstance, options: FastifyPluginOptions) {
    const { conversationAdapter } = options;
    fastify.post('/converse', async (request : FastifyRequest, reply: FastifyReply) => {
        await conversationAdapter.createConversation();
        return reply.status(201).send('Conversation created successfully.')
    })

    fastify.post('/converse/:conversation_id/messages', async (request : FastifyRequest, reply: FastifyReply) => {

    })
}

export default converse;