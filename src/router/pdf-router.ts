import express from "express";
import { uploadPdf } from "../controller/upload-pdf";
import pdfUpload from "../middleware/multer-config";

const router = express.Router();

router.post("/upload", pdfUpload.single("pdf"), uploadPdf);

export default router;