import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Request, Response } from "express";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const embedder = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

export const ChatWithPdf = async (req: Request, res: Response) => {
  try {
    const { query, collectionName } = req.body;

    if (!query || !collectionName) {
      res.status(400).json({ error: "Query and collection name are required" });
      return;
    }

    const vectorStore = new QdrantVectorStore(embedder, {
      url: process.env.QDRANT_URL,
      collectionName: collectionName,
    });

    if (!vectorStore) {
      res.status(400).json({ error: "Vector store not found" });
      return;
    }

    const result = await vectorStore.similaritySearch(query);

    const context = result.map((doc) => doc.pageContent).join("\n\n");

    const systemPrompt = `You are a helpful assistant that can answer questions from the provided context.
    context: ${context}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.status(200).json({
      message: "Chat completed successfully",
      response: response.text,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
};
