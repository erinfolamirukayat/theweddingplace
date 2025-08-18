import { Router, Request } from 'express';
import multer from 'multer';
import { uploadImage, uploadImageFromUrl } from '../controllers/upload';

const router = Router();

// Configure multer for in-memory storage, which is required by the Supabase controller.
// The controller will handle the file buffer directly.
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB limit
    },
    fileFilter: fileFilter
});
// Route for direct file uploads. The 'upload.single('image')' middleware
// processes the file and makes it available as `req.file` in the controller.
router.post('/image', upload.single('image'), uploadImage);

// Route for uploading from a URL, which is handled by the controller.
router.post('/image-from-url', uploadImageFromUrl);

export default router; 