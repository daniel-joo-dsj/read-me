import type { DistanceStrategy } from "@langchain/community/vectorstores/pgvector";
import type { Pool } from "pg";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";


export async function createVectorStore(pool: Pool) {
    const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGING_FACE_API_KEY!,
        model: process.env.HUGGING_FACE_MODEL!,
    })

    const config = {
        pool: pool,
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
        