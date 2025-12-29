import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
 
export class Chunkifier {
    loader : PDFLoader;
    textSplitter : RecursiveCharacterTextSplitter

    constructor(filepath : string) {
        this.loader = new PDFLoader(filepath)
        this.textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
    }

    async #readPDF() : Promise<Document<Record<string, any>>[]> {
        const docs = await this.loader.load()
        return docs!
    }

    async #chunk(documents : Document<Record<string, any>>[]) : Promise<Document[]> {
        // TODO: semantic chunking
        return await this.textSplitter.splitDocuments(documents)
    }

    async chunkify() : Promise<Document[]> {
        const documents = await this.#readPDF()
        return await this.#chunk(documents)
    }
}
