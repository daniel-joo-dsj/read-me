import type { ConversationParams } from '@application/conversation/conversation.js';
import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'


async function converse (fastify: FastifyInstance, options: FastifyPluginOptions) {
    const { conversationAdapter, agent } = options;
    fastify.post('/converse', async (request : FastifyRequest, reply: FastifyReply) => {
        await conversationAdapter.createConversation();
        return reply.status(201).send('Conversation created successfully.')
    })

    fastify.post('/converse/:conversation_id/messages', async (request : FastifyRequest<{Params: ConversationParams, Body: { message: string }}>, reply: FastifyReply) => {
        const response = await conversationAdapter.converse(request.params.conversation_id, request.body.message, agent)
        return reply.status(201).send(response);
    })
}

export default converse;