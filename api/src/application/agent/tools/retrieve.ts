import { tool } from "@langchain/core/tools";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import type { Logger } from "@application/logger.js";
import type { Document } from "langchain";
import { extractSemanticQuery } from "./extract-semantic-query.js";
import { ChatOpenAI } from "@langchain/openai"
import { retrievalSchema } from "@application/utils/retrieval-schema.js";


export async function retrieve(model: ChatOpenAI, vectorStore: PGVectorStore, logger: Logger) {
    return tool(
        async ({ query }) => {
            // Extract semantic query
            const semanticQuery = (await extractSemanticQuery(query, model)).query
            logger.info(`Extracted semantic query: ${semanticQuery}`)

            // Vectorstore similarity search
            const retrievedDocs = await vectorStore.similaritySearch(semanticQuery, 5);
            logger.info(`Retrieved documents: ${convertDocsToStrings(retrievedDocs)}. Number of retrieved documents: ${retrievedDocs.length}`)

            // Map source to content
            const serialized = retrievedDocs.map((doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`).join("\n");
            return [serialized, retrievedDocs];
        },
        {
            name: "retrieve",
            description: "Retrieve information related to a query.",
            schema: retrievalSchema,
            responseFormat: "content_and_artifact",
        }
    );
}

function convertDocsToStrings(docs: Document[]) {
    const content: string[] = []
    docs.forEach(doc =>
        content.push(doc.pageContent)
    )
    return content
}