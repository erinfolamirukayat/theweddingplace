import { Request, Response } from 'express';
import { supabase, BUCKET_NAME } from '../config/supabase';
import axios from 'axios';

/**
 * Handles direct file uploads (e.g., from a form).
 * This controller expects to be used with a middleware like 'multer' that
 * populates `req.file` with the uploaded file's buffer and metadata.
 */
export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const file = req.file;
        // Create a unique filename to prevent overwriting existing files
        const fileName = `uploads/${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false, // Don't overwrite files with the same name
            });

        if (error) {
            throw error;
        }

        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        res.status(201).json({ url: urlData.publicUrl });
    } catch (error: any) {
        console.error('Error uploading image to Supabase:', error);
        res.status(500).json({ error: error.message || 'Failed to upload image.' });
    }
};

/**
 * Fetches an image from a provided URL, uploads it to Supabase Storage,
 * and returns the new, permanent URL.
 */
export const uploadImageFromUrl = async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    try {
        // 1. Fetch the image from the external URL as a buffer
        const imageResponse = await axios.get(url, {
            responseType: 'arraybuffer', // Important to get raw image data
            timeout: 10000, // Set a 10-second timeout to prevent long-running requests
        });

        const fileBuffer = Buffer.from(imageResponse.data, 'binary');
        const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
        
        // Create a unique filename
        const originalName = url.split('/').pop()?.split('?')[0] || 'image.jpg';
        const fileName = `uploads/${Date.now()}-${originalName.replace(/\s/g, '-')}`;

        // 2. Upload the image buffer to your Supabase Storage bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, { contentType, upsert: false });

        if (uploadError) {
            throw uploadError;
        }

        // 3. Get the public URL of the newly uploaded file
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData.path);

        // 4. Return the new, permanent Supabase URL to the client
        res.status(201).json({ url: urlData.publicUrl });
    } catch (error: any) {
        console.error('Failed to process image from URL:', error.message);
        if (axios.isAxiosError(error)) {
            return res.status(400).json({ error: `Could not fetch image from the provided URL. Reason: ${error.message}` });
        }
        res.status(500).json({ error: 'Failed to process image from URL.' });
    }
};