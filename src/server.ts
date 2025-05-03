import dotenv from "dotenv";
dotenv.config();
import express from "express";
import pdfRouter from "./router/pdf-router";
import chatRouter from "./router/chat-router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/pdf", pdfRouter);
app.use("/api/pdf", chatRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
