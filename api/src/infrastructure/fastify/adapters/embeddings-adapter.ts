import fs from 'fs/promises';
import { FileDoesNotExistError } from '@infrastructure/errors/file-does-not-exist-error.js';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { embedFile } from '@application/file/embed.js';
import type { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import type { Logger } from '@application/logger.js';


export class EmbeddingsAdapter {
    uploadPath : string;
    vectorStore: PGVectorStore;
    logger: Logger;

    constructor(uploadPath: string, vectorStore: PGVectorStore, logger: Logger) {
        this.uploadPath = uploadPath;
        this.vectorStore = vectorStore;
        this.logger = logger;
    }
    async #createPDFLoader(filename: string) {
        const files = await fs.readdir(this.uploadPath)

        // Check if file exists in ../uploads directory
        if (!files.includes(filename)) {
            throw new FileDoesNotExistError()
        }

        const filepath = this.uploadPath + filename;
        return new PDFLoader(filepath);
    }

    async #createTextSplitter() {
        return new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 })
    }

    async embed(filename: string) {
        const loader = await this.#createPDFLoader(filename);
        const textSplitter = await this.#createTextSplitter();
        await embedFile(this.logger, loader, textSplitter, this.vectorStore)
    }
}

