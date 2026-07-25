import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  getRegistryPictures,
  addRegistryPicture,
  removeRegistryPicture,
  uploadImageFile,
} from '../utils/api';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, UploadCloudIcon, TrashIcon } from 'lucide-react';
import { useNotification } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const MAX_PHOTOS = 10;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);

  // Photo modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photosToUpload, setPhotosToUpload] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { setMessage } = useNotification();
  const { user, loading: authLoading, registries } = useAuth();

  useEffect(() => {
    // Don't fetch data until authentication is resolved and we have a user.
    if (authLoading || !user || registries.length === 0) {
      if (!authLoading) {
        setLoading(false);
        setDetails(null); // Clear details if no registries
      }
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const mainRegistry = registries[0];
        const pics = await getRegistryPictures(mainRegistry.id);
        setDetails({
          ...mainRegistry,
          photos: pics.map((p: any) => p.image_url),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, registries]);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentPhotoCount = (details?.photos?.length || 0) + photosToUpload.length;
      const remainingSlots = MAX_PHOTOS - currentPhotoCount;

      if (files.length > remainingSlots) {
        setMessage(`You can only add ${remainingSlots} more photo(s).`, 'error');
        setPhotosToUpload(prev => [...prev, ...files.slice(0, remainingSlots)]);
      } else {
        setPhotosToUpload(prev => [...prev, ...files]);
      }
    }
  };

  const handleRemoveNewPhoto = (index: number) => {
    setPhotosToUpload(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingPhoto = async (photoUrl: string) => {
    if (!registries[0]) return;
    try {
      await removeRegistryPicture(registries[0].id, photoUrl);
      setDetails((d: any) => ({
        ...d,
        photos: d.photos.filter((p: string) => p !== photoUrl)
      }));
      setMessage('Photo deleted successfully!');
    } catch (error) {
      setMessage('Failed to delete photo.', 'error');
      console.error(error);
    }
  };

  const handleSavePhotos = async () => {
    if (!registries[0]) return;
    setUploading(true);
    try {
      for (const file of photosToUpload) {
        const data = await uploadImageFile(file);
        await addRegistryPicture(registries[0].id, data.url);
      }

      const pics = await getRegistryPictures(registries[0].id);
      setDetails((d: any) => ({
        ...d,
        photos: pics.map((p: any) => p.image_url)
      }));
      setPhotosToUpload([]);
      setIsPhotoModalOpen(false);
      setMessage('Photos updated successfully!');
    } catch (error) {
      setMessage('Failed to update photos.', 'error');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-4">
      {/* Section 2: Quick Links */}
      <section className="bg-white rounded shadow p-4 sm:p-6 flex flex-col gap-3 items-center justify-center mb-6 sm:mb-8">
        {loading ? (
          <div>Loading...</div>
        ) : registries.length > 0 ? (
          <Link
            to={`/registry/${registries[0].id}`}
            className="w-full text-center px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]"
          >
            View Registry
          </Link>
        ) : (
          <Link
            to="/create-registry"
            className="w-full text-center px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]"
          >
            Create Registry
          </Link>
        )}
        <Link to="/catalog" className="w-full text-center px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">Browse Products</Link>
        <Link to="/profile" className="w-full text-center px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">My Profile</Link>
      </section>

      {/* Section 3: Registry Details */}
      {details && (
        <div>
          <section className="mb-6 sm:mb-8 bg-white rounded shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Registry Details</h2>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <div className="font-semibold">Couple Names:</div>
                <div>{details.couple_names}</div>
              </div>
              <button className="text-[#B8860B] underline">Edit</button>
            </div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <div className="font-semibold">Wedding Photos:</div>
                <div className="flex gap-2 mt-1 flex-wrap">{details.photos?.length === 0 ? <span className="text-gray-400">No photos</span> : details.photos.map((url: string, i: number) => <img key={i} src={url} alt={`Wedding photo ${i + 1}`} className="w-16 h-16 object-cover rounded" />)}</div>
              </div>
              <button onClick={() => setIsPhotoModalOpen(true)} className="text-[#B8860B] underline">Edit</button>
            </div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <div className="font-semibold">Love Story:</div>
                <div>{details.story}</div>
              </div>
              <button className="text-[#B8860B] underline">Edit</button>
            </div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <div className="font-semibold">Wedding Date:</div>
                <div>{details.wedding_date}</div>
              </div>
              <button className="text-[#B8860B] underline">Edit</button>
            </div>
          </section>

          {/* Photo Edit Modal */}
          <Transition.Root show={isPhotoModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setIsPhotoModalOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                      <div>
                        <div className="flex justify-between items-center">
                          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Edit Wedding Photos
                          </Dialog.Title>
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setIsPhotoModalOpen(false)}
                          >
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">You can have up to {MAX_PHOTOS} photos.</p>
                          
                          {/* Existing Photos */}
                          <div className="mt-4">
                            <h4 className="text-md font-medium text-gray-700">Current Photos</h4>
                            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-4">
                              {details?.photos?.map((photo: string, index: number) => (
                                <div key={index} className="relative group">
                                  <img src={photo} alt={`Wedding photo ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                  <button
                                    onClick={() => handleDeleteExistingPhoto(photo)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Delete photo"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* New Photos to Upload */}
                          {photosToUpload.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-medium text-gray-700">New Photos to Upload</h4>
                              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {photosToUpload.map((file, index) => (
                                  <div key={index} className="relative group">
                                    <img src={URL.createObjectURL(file)} alt={`New photo ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                    <button
                                      onClick={() => handleRemoveNewPhoto(index)}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      aria-label="Remove photo"
                                    >
                                      <XIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Upload Area */}
                          {(details?.photos?.length + photosToUpload.length) < MAX_PHOTOS && (
                            <div className="mt-6">
                              <label
                                htmlFor="photo-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-[#B8860B] hover:text-[#8B6508] focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 flex items-center justify-center border-2 border-dashed border-gray-300 p-6"
                              >
                                <UploadCloudIcon className="h-8 w-8 mr-2" />
                                <span>Upload more photos</span>
                                <input
                                  id="photo-upload"
                                  name="photo-upload"
                                  type="file"
                                  className="sr-only"
                                  multiple
                                  accept="image/*"
                                  onChange={handlePhotoFileChange}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#B8860B] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#8B6508] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50"
                          onClick={handleSavePhotos}
                          disabled={uploading || photosToUpload.length === 0}
                        >
                          {uploading ? 'Saving...' : 'Save Photos'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => {
                            setIsPhotoModalOpen(false);
                            setPhotosToUpload([]); // Clear staged photos on cancel
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

        </div>)}
    </div>
  );
};

export default Dashboard;