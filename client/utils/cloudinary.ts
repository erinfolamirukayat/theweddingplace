export const CLOUDINARY_CLOUD_NAME = 'dex3v19sz';
export const CLOUDINARY_UPLOAD_PRESET = 'user_photo_preset';
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads a File object to Cloudinary.
 * @param file The File object from an input element.
 * @returns An object containing the secure_url string.
 */
export const uploadImageFileToCloudinary = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload image to Cloudinary: ${errText}`);
  }

  const data = await res.json();
  return { url: data.secure_url };
};

/**
 * Fetches an image from a URL and uploads it to Cloudinary.
 * @param imageUrl The remote image URL.
 * @returns An object containing the secure_url string.
 */
export const uploadImageUrlToCloudinary = async (imageUrl: string): Promise<{ url: string }> => {
  // First, fetch the image as a blob
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    throw new Error('Failed to fetch image from URL');
  }
  const blob = await imageRes.blob();
  
  // Convert blob to File object (optional, FormData accepts Blobs as well)
  const file = new File([blob], 'uploaded_image.jpg', { type: blob.type });

  // Upload to Cloudinary
  return uploadImageFileToCloudinary(file);
};
