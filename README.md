# PDF RAG (Retrieval-Augmented Generation) Application

This is a TypeScript Node.js application that allows you to:

1. Upload PDF files
2. Process and index the contents using embeddings stored in a Qdrant vector database
3. Chat with your PDF content using Google's Gemini AI

## Features

- PDF upload and processing
- Vector embeddings with Google Generative AI
- Semantic search and RAG using Qdrant vector database
- Chat interface to query PDF contents
- TypeScript for type safety
- Express framework for handling HTTP requests

## Prerequisites

- Node.js (v16.x or higher recommended)
- npm (v8.x or higher)
- Docker and Docker Compose (for running Qdrant database)
- Google Gemini API key

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd pdf_rag
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and add your Gemini API key:

```bash
cp .env.sample .env
```

Update the `.env` file with your actual Gemini API key:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
QDRANT_URL=http://localhost:6333
PORT=3000
```

### 4. Start Qdrant database with Docker

```bash
docker-compose -f docker-compose.db.yml up -d
```

This command will start the Qdrant vector database in a Docker container, exposing it on port 6333.

### 5. Run the development server

```bash
npm run dev
```

The server will start at http://localhost:3000 (or the port specified in your .env file).

## API Endpoints

### Upload PDF

Upload a PDF file to be processed and indexed in the vector database.

- **Endpoint**: `POST /api/pdf/upload`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `pdf`: PDF file (max size: 10MB)
- **Response**:
  ```json
  {
    "message": "PDF processed successfully",
    "collectionName": "filename.pdf",
    "content": [...]
  }
  ```

### Chat with PDF

Send a query to chat with the content of a previously uploaded PDF.

- **Endpoint**: `POST /api/pdf/chat`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "query": "What is the main topic of this document?",
    "collectionName": "filename.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Chat completed successfully",
    "response": "The main topic of this document is..."
  }
  ```

## How It Works

1. **PDF Upload**: The application accepts PDF files, converts them to text, and splits them into chunks.
2. **Vector Embedding**: Each text chunk is converted into a vector embedding using Google's Generative AI model.
3. **Vector Storage**: The embeddings are stored in a Qdrant vector database for efficient semantic search.
4. **Chat Interface**: When a query is sent, the application:
   - Converts the query to an embedding
   - Finds the most semantically similar text chunks in the database
   - Uses these relevant chunks as context for Google's Gemini AI to generate a response

## Project Structure

```
.
├── src/                  # Source code
│   ├── controller/       # API controllers
│   │   ├── chat.ts       # Chat controller
│   │   └── upload-pdf.ts # PDF upload controller
│   ├── middleware/       # Express middleware
│   │   └── multer-config.ts # File upload configuration
│   ├── router/           # API routes
│   │   ├── chat-router.ts # Chat routes
│   │   └── pdf-router.ts # PDF upload routes
│   └── server.ts         # Main server file
├── docker-compose.db.yml # Docker configuration for Qdrant
├── .env                  # Environment variables (create from .env.sample)
├── package.json          # Project metadata and dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```
