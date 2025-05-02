# TypeScript Node.js Server

A basic TypeScript Node.js server project using Express.

## Features

- TypeScript for type safety
- Express framework for handling HTTP requests
- Development tools including ts-node and nodemon
- Basic API endpoints

## Getting Started

### Prerequisites

- Node.js (v14.x or higher recommended)
- npm (v6.x or higher)

### Installation

1. Clone the repository or use the files directly
2. Install dependencies

```bash
npm install
```

### Development

To start the development server with hot reloading:

```bash
npm run dev
```

### Build

To build the project for production:

```bash
npm run build
```

### Run in Production

To run the built version:

```bash
npm start
```

## API Endpoints

- `GET /`: Returns a welcome message
- `GET /health`: Returns server health status with timestamp

## Project Structure

```
.
├── src/                # Source code
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript (generated after build)
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```