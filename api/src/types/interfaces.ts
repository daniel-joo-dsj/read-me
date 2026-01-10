import type { FastifyInstance } from 'fastify'

export interface InitializationProps {
    dirPath: string,
    fastify: FastifyInstance
}

export interface FilenameParams {
    filename: string;
}

export interface File {
    buffer: Buffer
    filename: string
    mimetype: string
    size: number
}