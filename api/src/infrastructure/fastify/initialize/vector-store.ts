import type { DistanceStrategy } from "@langchain/community/vectorstores/pgvector";
import type { PoolConfig } from "pg";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";


export async function createVectorStore() {
    const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGING_FACE_API_KEY!,
        model: process.env.HUGGING_FACE_MODEL!,
    })

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
        embeddings,
        config
    )
}
        