import type { FastifyInstance } from 'fastify'

export interface InitializationProps {
    dirPath: string,
    fastify: FastifyInstance
}

export interface FilenameParams {
    filename: string;
}
