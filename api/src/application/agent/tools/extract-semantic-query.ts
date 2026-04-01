import { ChatOpenAI } from "@langchain/openai";
import { retrievalSchema } from "@application/utils/retrieval-schema.js";

export async function extractSemanticQuery(query: string, model: ChatOpenAI) {
    const prompt = `
        Extract a semantic query for improving retrieval in a RAG application.

        Query: ${query}
    `
    const structuredModel = model.withStructuredOutput(retrievalSchema)
    const result = await structuredModel.invoke(prompt)
    return result
}
