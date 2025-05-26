import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

router.post('/image', upload.single('image'), (req, res) => {
  console.log('Upload request received:', req.body);
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the URL to the uploaded file
  const url = `/uploads/${req.file.filename}`;
  console.log('File uploaded successfully:', url);
  res.json({ url });
});

export default router; 