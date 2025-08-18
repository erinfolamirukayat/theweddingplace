import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, HeartIcon, SaveIcon, ImageIcon, XIcon, AlertCircleIcon } from 'lucide-react';
import { createRegistry as apiCreateRegistry, addRegistryPicture } from '../utils/api';
import { useNotification } from '../components/Layout';
import { getConfig } from '../config';

const MAX_IMAGES = 10;

const CreateRegistry = () => {
  const navigate = useNavigate();
  const { setMessage } = useNotification();
  const [formData, setFormData] = useState({
    couple_names: '',
    wedding_date: '',
    story: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userFields, setUserFields] = useState({
    phone: '',
    wedding_city: '',
  });

  const [imageSourceType, setImageSourceType] = useState<'none' | 'file' | 'url'>('none');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleUserFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrl) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please enter an image URL' }));
      return;
    }
    if (imageUrls.length >= MAX_IMAGES) {
      setErrors(prev => ({ ...prev, imageUrl: `Maximum ${MAX_IMAGES} images allowed` }));
      return;
    }
    try {
      new URL(imageUrl);
      setImageUrls(prev => [...prev, imageUrl]);
      setImageUrl('');
      setErrors(prev => {
        const updated = { ...prev };
        delete updated.imageUrl;
        return updated;
      });
    } catch {
      setErrors(prev => ({ ...prev, imageUrl: 'Please enter a valid URL' }));
    }
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalFiles = imageFiles.length + files.length;
      if (totalFiles > MAX_IMAGES) {
        setErrors(prev => ({ ...prev, file: `You can only upload a maximum of ${MAX_IMAGES} files.` }));
        // Optionally, only take enough files to reach the limit
        const remainingSlots = MAX_IMAGES - imageFiles.length;
        setImageFiles(prev => [...prev, ...files.slice(0, remainingSlots)]);
      } else {
        setImageFiles(prev => [...prev, ...files]);
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.couple_names.trim()) newErrors.couple_names = 'Couple names are required';
    if (!formData.wedding_date) newErrors.wedding_date = 'Wedding date is required';
    if (!userFields.phone.trim()) newErrors.phone = 'WhatsApp phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;
    setLoading(true);
    setUploading(true);
    try {
      // Upload files and collect URLs
      let finalImageUrls: string[] = [];

      if (imageSourceType === 'file') {
        for (const file of imageFiles) {
          const formDataFile = new FormData();
          formDataFile.append('image', file);
          const res = await fetch(`${getConfig().apiUrl}/upload/image`, {
            method: 'POST',
            body: formDataFile,
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Failed to upload ${file.name}`);
          }
          const data = await res.json();
          finalImageUrls.push(data.url);
        }
      } else if (imageSourceType === 'url') {
        // For each user-provided URL, ask the backend to fetch it and store it in our Supabase bucket.
        for (const imageUrl of imageUrls) {
          const res = await fetch(`${getConfig().apiUrl}/upload/image-from-url`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: imageUrl }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Failed to process image from URL: ${imageUrl}`);
          }

          const data = await res.json();
          finalImageUrls.push(data.url);
        }
      }
      // Create the registry first (without pictures)
      const registry = await apiCreateRegistry({
        couple_names: formData.couple_names,
        wedding_date: formData.wedding_date,
        story: formData.story,
        phone: userFields.phone,
        wedding_city: userFields.wedding_city,
      });
      // Add each picture to the registry
      for (const url of finalImageUrls) {
        await addRegistryPicture(registry.id, url);
      }
      localStorage.setItem('afriwed_registry_id', registry.id);
      setMessage('Registry created successfully!');
      navigate(`/registry/${registry.id}`);
    } catch (err: any) {
      setApiError(err.message || 'Failed to create registry');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return <div className="max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Your Wedding Registry</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="couple_names" className="block text-sm font-medium text-gray-700">
              Couple Names
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HeartIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" name="couple_names" id="couple_names" value={formData.couple_names} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.couple_names ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B]`} placeholder="e.g. Ada & Chinedu" />
            </div>
            {errors.couple_names && <p className="mt-1 text-sm text-red-600">{errors.couple_names}</p>}
          </div>
          <div>
            <label htmlFor="wedding_date" className="block text-sm font-medium text-gray-700">
              Wedding Date
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="date" name="wedding_date" id="wedding_date" value={formData.wedding_date} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.wedding_date ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B]`} />
            </div>
            {errors.wedding_date && <p className="mt-1 text-sm text-red-600">{errors.wedding_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={userFields.phone}
              onChange={handleUserFieldChange}
              className={`block w-full border rounded px-3 py-2 mb-2 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City of Wedding Ceremony (optional)</label>
            <input
              type="text"
              name="wedding_city"
              value={userFields.wedding_city}
              onChange={handleUserFieldChange}
              className="block w-full border rounded px-3 py-2 mb-2 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Wedding Pictures</label>
            <select
              value={imageSourceType}
              onChange={(e) => setImageSourceType(e.target.value as 'none' | 'file' | 'url')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
            >
              <option value="none">I'll add pictures later</option>
              <option value="file">Upload from my device</option>
              <option value="url">Add from web links (e.g., Google Drive)</option>
            </select>
          </div>

          {imageSourceType === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-4">Upload Files (up to {MAX_IMAGES})</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B8860B] file:text-white hover:file:bg-[#8B6508]"
                disabled={imageFiles.length >= MAX_IMAGES}
              />
              {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    <button type="button" onClick={() => handleRemoveFile(idx)} className="absolute top-0 right-0 bg-white rounded-full p-1 shadow">
                      <XIcon className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {imageSourceType === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-4">Add Image URLs (up to {MAX_IMAGES})</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                  placeholder="Paste image URL and click Add"
                  disabled={imageUrls.length >= MAX_IMAGES}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] disabled:bg-gray-400"
                  disabled={!imageUrl || imageUrls.length >= MAX_IMAGES}
                >
                  Add
                </button>
              </div>
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img src={url} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    <button type="button" onClick={() => handleRemoveUrl(idx)} className="absolute top-0 right-0 bg-white rounded-full p-1 shadow">
                      <XIcon className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <label htmlFor="story" className="block text-sm font-medium text-gray-700">
              Our Story (optional)
            </label>
            <textarea name="story" id="story" value={formData.story} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]" rows={3} placeholder="Share your love story..." />
          </div>
        </div>
        {apiError && <div className="mt-4 flex items-center text-red-600"><AlertCircleIcon className="h-5 w-5 mr-2" />{apiError}</div>}
        <div className="mt-8 flex justify-end">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]" disabled={loading || uploading}>
            <SaveIcon className="h-5 w-5 mr-2" />
            {loading ? 'Creating...' : 'Create Registry'}
          </button>
        </div>
      </form>
    </div>
  </div>;
};

export default CreateRegistry;