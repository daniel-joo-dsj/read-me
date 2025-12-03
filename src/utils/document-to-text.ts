import { Document } from '@langchain/core/documents';


export function documentsToStrings(documents : Document[]) : string[]  {
    const texts : string[] = []
    for (const document of documents) {
        texts.push(document.pageContent)
    }
    return texts
}