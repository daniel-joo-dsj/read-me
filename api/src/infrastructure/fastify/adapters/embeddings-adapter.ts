import type { FastifyRequest } from 'fastify'
import fs from 'fs/promises';
import type { FilenameParams } from '@domain/files/filename-params.js';
import { FileDoesNotExistError } from '@infrastructure/errors/file-does-not-exist-error.js';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { embedFile } from '@application/embed-file.js';
import type { PGVectorStore } from '@langchain/community/vectorstores/pgvector';


export class EmbeddingsAdapter {
    uploadPath : string;
    vectorStore: PGVectorStore

    constructor(uploadPath: string, vectorStore: PGVectorStore) {
        this.uploadPath = uploadPath;
        this.vectorStore = vectorStore;
    }
    async #createPDFLoader(request: FastifyRequest<{Params : FilenameParams}>) {
        const files = await fs.readdir(this.uploadPath)

        // Check if file exists in ../uploads directory
        if (!files.includes(request.params.filename)) {
            throw new FileDoesNotExistError()
        }

        const filepath = this.uploadPath + request.params.filename;
        return new PDFLoader(filepath);
    }

    async #createTextSplitter() {
        return new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
    }

    async embed(request: FastifyRequest<{Params : FilenameParams}>) {
        const loader = await this.#createPDFLoader(request);
        const textSplitter = await this.#createTextSplitter();
        await embedFile(request.log, loader, textSplitter, this.vectorStore)
    }
}

