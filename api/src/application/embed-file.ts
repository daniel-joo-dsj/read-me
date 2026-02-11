import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { v4 as uuidv4 } from "uuid";


async function createChunks(loader: PDFLoader, textSplitter: RecursiveCharacterTextSplitter) {
    const docs = await loader.load();
    return await textSplitter.splitDocuments(docs);
}

export async function embedFile(loader: PDFLoader, textSplitter: RecursiveCharacterTextSplitter, vectorStore: PGVectorStore, 
) {
    const chunks = await createChunks(loader, textSplitter);

    // embed into vector store
    const ids = chunks.map(() => uuidv4());
    await vectorStore.addDocuments(chunks, { ids: ids });
}
