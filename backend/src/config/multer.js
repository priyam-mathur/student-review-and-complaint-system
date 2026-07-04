import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/ApiError.js';
import env from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../../', env.uploadDir);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type '${file.mimetype}' is not allowed. Allowed types: JPEG, PNG, GIF, WebP, PDF, DOC, DOCX, XLS, XLSX`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSize,
    files: 5,
  },
});

export default upload;
