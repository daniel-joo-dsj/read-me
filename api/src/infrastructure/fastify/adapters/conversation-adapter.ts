import type { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid'
import type { Conversation } from '@application/conversation/conversation.js';
import { SQLInsertionError } from '@infrastructure/errors/sql-insertion-error.js';
import type { Logger } from '@application/logger.js';
import type { Message } from '@application/message/message.js';
import { createAgent } from 'langchain';

export class ConversationAdapter {
    pool : Pool
    logger: Logger

    constructor(pool: Pool, logger: Logger) {
        this.pool = pool;
        this.logger = logger;
    }

    async createConversation() {
        const date = new Date()
        const conversation: Conversation = {
            id: uuidv4(),
            created_at: date.toISOString(),
        }
        const query = `
            INSERT INTO conversations (id, created_at)
            VALUES ('${conversation.id}', '${conversation.created_at}')
            RETURNING created_at
        `;
        try {
            await this.pool.query(query)
            this.logger.info(`Conversation inserted successfully. ID: ${conversation.id}`)
        } catch (error) {
            throw new SQLInsertionError(query)
        }
    }

    async converse(conversation_id: string, userMessage: string, agent: ReturnType<typeof createAgent>) {
        // Save user message
        const date = new Date()
        const message: Message = {
            id: uuidv4(),
            conversation_id: conversation_id,
            role: 'user',
            content: userMessage,
            created_at: date.toISOString()
        }
        await this.saveMessage(message);

        // Agent response
        const agentInputs = { messages: [{ role: "user", content: userMessage }] };
        try {
            const response = await agent.invoke(agentInputs)
            const messages = response.messages
            this.logger.info(`Created response: ${messages}`)

            return messages[messages.length - 1]?.content;
        } catch (err: any) {
            this.logger.error(err.name);
            this.logger.error(err.message);
            this.logger.error(err.stack);
            this.logger.error(err.cause);
        }
        return 'Could not produce response.'
    }

    async saveMessage(message: Message) {
        const query = `
            INSERT INTO messages (id, conversation_id, role, content, created_at)
            VALUES ('${message.id}', '${message.conversation_id}', '${message.role}', '${message.content}', '${message.created_at}')
        `;
        try {
            await this.pool.query(query)
            this.logger.info(`${message.id} saved successfully with conversation ${message.conversation_id}`)
        } catch (error) {
            throw new SQLInsertionError(query)
        }
    }
}