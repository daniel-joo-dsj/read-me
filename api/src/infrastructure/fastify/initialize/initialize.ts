import * as fs from 'fs/promises';
import type { FastifyInstance } from 'fastify'
import type { InitializationProps } from './props.js'


async function createUploadDirectory(fastify: FastifyInstance, dirPath: string) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        fastify.log.info('Directory created')
    } catch (err) {
        fastify.log.error(err)
    }
}

export async function initialize(props: InitializationProps) {
    createUploadDirectory(props.fastify, props.dirPath)
}