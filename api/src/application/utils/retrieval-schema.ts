import * as z from "zod";

export const retrievalSchema = z.object(
    {
        query: z.string()
    }
);