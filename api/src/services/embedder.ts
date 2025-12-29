import { Document } from '@langchain/core/documents';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import type { PoolConfig } from "pg";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import type { DistanceStrategy } from "@langchain/community/vectorstores/pgvector";
import { v4 as uuidv4 } from "uuid";

 
export class Embedder {
    embeddings: HuggingFaceInferenceEmbeddings
    vectorStore: Promise<PGVectorStore>

    constructor() {
        this.embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HUGGING_FACE_API_KEY!,
            model: process.env.HUGGING_FACE_MODEL!,
        });
        this.vectorStore = this.#createVectorStore();
    }
    async #createVectorStore() : Promise<PGVectorStore>{
        const config = {
            postgresConnectionOptions: {
                type: "postgres",
                host: process.env.DB_CONTAINER_NAME,
                port: process.env.DB_PORT,
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
            } as PoolConfig,
            tableName: "embeddings",
            columns: {
                idColumnName: "id",
                vectorColumnName: "embedding",
                contentColumnName: "content",
                metadataColumnName: "metadata",
            },
            distanceStrategy: "cosine" as DistanceStrategy,
        }
        return await PGVectorStore.initialize(
            this.embeddings,
            config
        )
    }
    async embedChunks(chunks: Document[]) : Promise<void> {
        const ids = chunks.map(() => uuidv4());
        await (await this.vectorStore).addDocuments(chunks, { ids: ids });
    }
}
