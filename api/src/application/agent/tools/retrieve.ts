import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import type { Logger } from "@application/logger.js";
import type { Document } from "langchain";


export async function retrieve(vectorStore: PGVectorStore, logger: Logger) {
    const retrieveSchema = z.object({ query: z.string() });
    return tool(
        async ({ query }) => {
            const retrievedDocs = await vectorStore.similaritySearch(query, 5);
            logger.info(`Retrieved documents: ${convertDocsToContent(retrievedDocs)}. Number of retrieved documents: ${retrievedDocs.length}`)
            const serialized = retrievedDocs.map((doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`).join("\n");
            return [serialized, retrievedDocs];
        },
        {
            name: "retrieve",
            description: "Retrieve information related to a query.",
            schema: retrieveSchema,
            responseFormat: "content_and_artifact",
        }
    );
}

function convertDocsToContent(docs: Document[]) {
    const content: string[] = []
    docs.forEach(doc =>
        content.push(doc.pageContent)
    )
    return content
}