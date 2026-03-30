import type { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid'
import type { Conversation } from '@application/conversation/conversation.js';
import { SQLInsertionError } from '@infrastructure/errors/sql-insertion-error.js';
import type { Logger } from '@application/logger.js';

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
            const result = this.pool.query(query)
            this.logger.info('Query executed successfully.', result)
        } catch (error) {
            throw new SQLInsertionError(query)
        }
    }
    async converse() {

    }
}

