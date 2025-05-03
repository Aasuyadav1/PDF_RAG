import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Request, Response } from "express";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as crypto from "crypto";

const embedder = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export const uploadPdf = async (req: Request, res: Response) => {

  let tempFilePath = "";

  try {

    if (!req.file) {
      res.status(400).json({ error: "No PDF file uploaded" });
      return;
    }

    const pdfBuffer = req.file.buffer;

    const tempFileName = `${crypto.randomUUID()}.pdf`;
    tempFilePath = path.join(os.tmpdir(), tempFileName);

    fs.writeFileSync(tempFilePath, pdfBuffer);

    const loader = new PDFLoader(tempFilePath);

    const docs = await loader.load();

    const splitDocs = await textSplitter.splitDocuments(docs);

    const client = new QdrantClient({ url: "http://localhost:6333" });

    const collectionExists = await client.collectionExists(
      req.file.originalname
    );

    if (collectionExists) {
      await client.deleteCollection(req.file.originalname);
    }

    await QdrantVectorStore.fromDocuments(splitDocs, embedder, {
      url: "http://localhost:6333",
      collectionName: req.file.originalname,
    });

    res.status(200).json({
      message: "PDF processed successfully",
      collectionName: req.file.originalname,
      content: splitDocs,
    });
    
  } catch (error) {

    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });

  } finally {

    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

  }
};
