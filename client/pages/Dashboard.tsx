import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  getRegistryPictures,
  addRegistryPicture,
  removeRegistryPicture,
  uploadImageFile,
  updateRegistry as apiUpdateRegistry,
} from "../utils/api";
import { Dialog, Transition } from "@headlessui/react";
import {
  XIcon,
  UploadCloudIcon,
  TrashIcon,
  CalendarIcon,
  HeartIcon,
  GiftIcon,
  Edit3Icon,
  SettingsIcon,
  UserIcon,
  ExternalLinkIcon,
  ClockIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { useNotification } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const MAX_PHOTOS = 10;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, setUser, loading: authLoading, registries, registriesLoading } = useAuth();
  const [preference, setPreference] = useState(
    user?.notification_preference || "every_contribution",
  );

  const { addNotification, setMessage } = useNotification();

  const handleSaveSettings = async () => {
    try {
      const { updatePreferences } = await import("../utils/api");
      const updatedUser = await updatePreferences({
        notification_preference: preference,
      });
      setUser(updatedUser);
      addNotification("success", "Preferences updated successfully!");
      setIsSettingsOpen(false);
    } catch (err: any) {
      addNotification("error", err.message || "Failed to update preferences");
    }
  };

  const [detailsForm, setDetailsForm] = useState({
    bride_first_name: "",
    bride_last_name: "",
    groom_first_name: "",
    groom_last_name: "",
    story: "",
    wedding_date: "",
  });

  const handleOpenEditDetails = () => {
    if (!details) return;
    const names = details.couple_names
      ? details.couple_names.split(" & ")
      : ["", ""];
    const brideNames = names[0].split(" ");
    const groomNames = names[1] ? names[1].split(" ") : [""];
    setDetailsForm({
      bride_first_name: brideNames[0] || "",
      bride_last_name: brideNames.slice(1).join(" ") || "",
      groom_first_name: groomNames[0] || "",
      groom_last_name: groomNames.slice(1).join(" ") || "",
      story: details.story || "",
      wedding_date: details.wedding_date
        ? details.wedding_date.split("T")[0]
        : "",
    });
    setIsEditDetailsOpen(true);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registries[0]) return;
    try {
      const mergedNames = `${detailsForm.bride_first_name.trim()} ${detailsForm.bride_last_name.trim()} & ${detailsForm.groom_first_name.trim()} ${detailsForm.groom_last_name.trim()}`;
      const payload = { ...detailsForm, couple_names: mergedNames };
      await apiUpdateRegistry(registries[0].uuid, payload);
      setDetails((prev: any) => ({
        ...prev,
        ...detailsForm,
        couple_names: mergedNames,
      }));
      setIsEditDetailsOpen(false);
      setMessage("Registry details updated successfully!");
    } catch (error: any) {
      setMessage(
        error.message || "Failed to update registry details.",
        "error",
      );
    }
  };

  // Photo modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photosToUpload, setPhotosToUpload] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Don't fetch data until authentication is resolved and we have a user.
    if (authLoading || registriesLoading || !user || registries.length === 0) {
      if (!authLoading && !registriesLoading) {
        setLoading(false);
        setDetails(null); // Clear details if no registries
      }
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const mainRegistry = registries[0];
        localStorage.setItem("afriwed_registry_id", mainRegistry.uuid);
        const pics = await getRegistryPictures(mainRegistry.uuid);
        setDetails({
          ...mainRegistry,
          photos: pics.map((p: any) => p.image_url),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, registries, registriesLoading]);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentPhotoCount =
        (details?.photos?.length || 0) + photosToUpload.length;
      const remainingSlots = MAX_PHOTOS - currentPhotoCount;

      if (files.length > remainingSlots) {
        setMessage(
          `You can only add ${remainingSlots} more photo(s).`,
          "error",
        );
        setPhotosToUpload((prev) => [
          ...prev,
          ...files.slice(0, remainingSlots),
        ]);
      } else {
        setPhotosToUpload((prev) => [...prev, ...files]);
      }
    }
  };

  const handleRemoveNewPhoto = (index: number) => {
    setPhotosToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingPhoto = async (photoUrl: string) => {
    if (!registries[0]) return;
    try {
      await removeRegistryPicture(registries[0].uuid, photoUrl);
      setDetails((d: any) => ({
        ...d,
        photos: d.photos.filter((p: string) => p !== photoUrl),
      }));
      setMessage("Photo deleted successfully!");
    } catch (error) {
      setMessage("Failed to delete photo.", "error");
      console.error(error);
    }
  };

  const handleSavePhotos = async () => {
    if (!registries[0]) return;
    setUploading(true);
    try {
      for (const file of photosToUpload) {
        const data = await uploadImageFile(file);
        await addRegistryPicture(registries[0].uuid, data.url);
      }

      const pics = await getRegistryPictures(registries[0].uuid);
      setDetails((d: any) => ({
        ...d,
        photos: pics.map((p: any) => p.image_url),
      }));
      setPhotosToUpload([]);
      setIsPhotoModalOpen(false);
      setMessage("Photos updated successfully!");
    } catch (error) {
      setMessage("Failed to update photos.", "error");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  // Calculate days until wedding
  const getDaysUntilWedding = () => {
    if (!details?.wedding_date) return null;
    const today = new Date();
    const weddingDate = new Date(details.wedding_date);
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysUntil = getDaysUntilWedding();

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-12">
      {/* 1. Welcome Hero & Countdown */}
      <div className="bg-white border-b border-[#E8DCC4] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Welcome back,{" "}
              {details
                ? details.couple_names.split(" & ")[0]
                : user?.first_name || "there"}
              !
            </h1>
            <p className="mt-2 text-gray-500 text-lg">
              Manage your registry, track contributions, and prepare for your
              big day.
            </p>
          </div>
          {details?.wedding_date && daysUntil !== null && (
            <div className="bg-[#ECDFD7] border border-[#E8DCC4] rounded-2xl p-6 text-center shadow-sm min-w-[200px]">
              <div className="flex items-center justify-center text-[#B8860B] mb-2">
                <ClockIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold uppercase tracking-widest">
                  Countdown
                </span>
              </div>
              <div className="text-4xl font-black text-[#2C1810]">
                {daysUntil}
              </div>
              <div className="text-gray-500 text-sm mt-1 font-medium">
                Days to go!
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Loading / Empty State */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8860B] mx-auto mb-4"></div>
            Loading your dashboard...
          </div>
        ) : !registries.length ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Registry Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't created a registry yet. Set up your wedding details
              and start adding gifts today!
            </p>
            <Link
              to="/create-registry"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-lg shadow-sm hover:bg-[#8B6508] transition-colors"
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              Create Your Registry
            </Link>
          </div>
        ) : (
          <>
            {/* 2. Action Cards for Navigation */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <LayoutDashboardIcon className="w-5 h-5 mr-2 text-[#B8860B]" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to={`/registry/${registries[0].uuid}`}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#E8DCC4] flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-[#ECDFD7] text-[#B8860B] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ExternalLinkIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Manage Registry
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    View and share your active registry page.
                  </p>
                </Link>

                <Link
                  to="/catalog"
                  className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#E8DCC4] flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-[#ECDFD7] text-[#B8860B] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GiftIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Browse Products
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Add new gifts and funds to your list.
                  </p>
                </Link>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#E8DCC4] flex flex-col items-center text-center w-full"
                >
                  <div className="w-12 h-12 bg-[#ECDFD7] text-[#B8860B] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <SettingsIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Email Settings
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Control your notification preferences.
                  </p>
                </button>

                <Link
                  to="/profile"
                  className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#E8DCC4] flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-[#ECDFD7] text-[#B8860B] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">My Profile</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Update your personal account details.
                  </p>
                </Link>
              </div>
            </section>

            {/* 3. Redesigned Details Panel */}
            {details && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <HeartIcon className="w-5 h-5 mr-2 text-[#B8860B]" />
                    Wedding Details
                  </h2>
                  <button
                    onClick={handleOpenEditDetails}
                    className="inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] bg-white border border-[#E8DCC4] px-4 py-2 rounded-lg shadow-sm hover:bg-[#ECDFD7] transition-colors"
                  >
                    <Edit3Icon className="w-4 h-4 mr-2" />
                    Edit Details
                  </button>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        The Couple
                      </h3>
                      <div className="text-xl font-medium text-gray-900">
                        {details.couple_names}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Wedding Date
                      </h3>
                      <div className="flex items-center text-lg text-gray-900 font-medium">
                        <CalendarIcon className="w-5 h-5 mr-2 text-[#B8860B]" />
                        {details.wedding_date ? (
                          new Date(details.wedding_date).toLocaleDateString(
                            undefined,
                            { dateStyle: "long" },
                          )
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Our Love Story
                      </h3>
                      {details.story ? (
                        <blockquote className="border-l-4 border-[#B8860B] pl-4 italic text-gray-600 bg-gray-50 p-4 rounded-r-lg whitespace-pre-line">
                          {details.story}
                        </blockquote>
                      ) : (
                        <div className="text-gray-400 italic bg-gray-50 p-4 rounded-lg">
                          No story provided yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Gallery ({details.photos?.length || 0})
                      </h3>
                      <button
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="text-xs font-semibold text-[#B8860B] hover:underline flex items-center"
                      >
                        <Edit3Icon className="w-3 h-3 mr-1" /> Manage Photos
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-[200px]">
                      {details.photos?.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                          <UploadCloudIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-sm">
                            No photos uploaded yet
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {details.photos.map((url: string, i: number) => (
                            <div
                              key={i}
                              className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 group relative"
                            >
                              <img
                                src={url}
                                alt={`Wedding photo ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Existing Modals Keep Their Old Markup Since They Function Perfectly */}
        {details && (
          <>
            {/* Photo Modal */}
            <Transition.Root show={isPhotoModalOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={setIsPhotoModalOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setIsPhotoModalOpen(false)}
                          >
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold leading-6 text-gray-900 mb-4"
                            >
                              Manage Wedding Photos
                            </Dialog.Title>

                            <div className="mb-4 text-sm text-gray-600">
                              You can add up to {MAX_PHOTOS} photos. (
                              {details.photos.length + photosToUpload.length} /{" "}
                              {MAX_PHOTOS} used)
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                              {/* Existing Photos */}
                              {details.photos.map(
                                (url: string, idx: number) => (
                                  <div
                                    key={`existing-${idx}`}
                                    className="relative group aspect-square"
                                  >
                                    <img
                                      src={url}
                                      alt={`Wedding ${idx + 1}`}
                                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                      onClick={() =>
                                        handleDeleteExistingPhoto(url)
                                      }
                                      className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                      title="Delete photo"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                ),
                              )}

                              {/* New Photos to Upload */}
                              {photosToUpload.map((file, idx) => (
                                <div
                                  key={`new-${idx}`}
                                  className="relative group aspect-square"
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`New upload ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-indigo-200"
                                  />
                                  <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none"></div>
                                  <button
                                    onClick={() => handleRemoveNewPhoto(idx)}
                                    className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-500 shadow"
                                    title="Remove from selection"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}

                              {/* Upload Button */}
                              {details.photos.length + photosToUpload.length <
                                MAX_PHOTOS && (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-square cursor-pointer hover:bg-gray-50 transition-colors">
                                  <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-xs text-gray-500 text-center px-2">
                                    Click to select
                                    <br />
                                    more photos
                                  </span>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoFileChange}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            disabled={uploading || photosToUpload.length === 0}
                            className="inline-flex w-full justify-center rounded-md bg-[#B8860B] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#8B6508] sm:ml-3 sm:w-auto disabled:opacity-50"
                            onClick={handleSavePhotos}
                          >
                            {uploading
                              ? "Uploading..."
                              : `Upload ${photosToUpload.length} New Photo(s)`}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => {
                              setIsPhotoModalOpen(false);
                              setPhotosToUpload([]); // clear staged on cancel
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

            {/* Edit Details Modal */}
            <Transition.Root show={isEditDetailsOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={setIsEditDetailsOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setIsEditDetailsOpen(false)}
                          >
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold leading-6 text-gray-900 mb-6"
                        >
                          Edit Registry Details
                        </Dialog.Title>

                        <form onSubmit={handleSaveDetails}>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Bride First Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={detailsForm.bride_first_name}
                                  onChange={(e) =>
                                    setDetailsForm({
                                      ...detailsForm,
                                      bride_first_name: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Bride Last Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={detailsForm.bride_last_name}
                                  onChange={(e) =>
                                    setDetailsForm({
                                      ...detailsForm,
                                      bride_last_name: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Groom First Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={detailsForm.groom_first_name}
                                  onChange={(e) =>
                                    setDetailsForm({
                                      ...detailsForm,
                                      groom_first_name: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Groom Last Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={detailsForm.groom_last_name}
                                  onChange={(e) =>
                                    setDetailsForm({
                                      ...detailsForm,
                                      groom_last_name: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Love Story
                              </label>
                              <textarea
                                rows={4}
                                value={detailsForm.story}
                                onChange={(e) =>
                                  setDetailsForm({
                                    ...detailsForm,
                                    story: e.target.value,
                                  })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Wedding Date
                              </label>
                              <input
                                type="date"
                                required
                                value={detailsForm.wedding_date}
                                onChange={(e) =>
                                  setDetailsForm({
                                    ...detailsForm,
                                    wedding_date: e.target.value,
                                  })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                              />
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end gap-3">
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              onClick={() => setIsEditDetailsOpen(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="inline-flex justify-center rounded-md border border-transparent bg-[#B8860B] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B6508]"
                            >
                              Save Details
                            </button>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Settings Modal */}
            <Transition.Root show={isSettingsOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={setIsSettingsOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold leading-6 text-gray-900"
                            >
                              Email Notifications
                            </Dialog.Title>
                            <div className="mt-4">
                              <form>
                                <div className="space-y-4">
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      value="every_contribution"
                                      checked={
                                        preference === "every_contribution"
                                      }
                                      onChange={(e) =>
                                        setPreference(e.target.value)
                                      }
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <span className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                                      Email me for every contribution
                                    </span>
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      value="daily_summary"
                                      checked={preference === "daily_summary"}
                                      onChange={(e) =>
                                        setPreference(e.target.value)
                                      }
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <span className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                                      Send me a daily summary of contributions
                                    </span>
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      value="none"
                                      checked={preference === "none"}
                                      onChange={(e) =>
                                        setPreference(e.target.value)
                                      }
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <span className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                                      Do not email me (I'll check the dashboard)
                                    </span>
                                  </label>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-[#B8860B] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#8B6508] sm:ml-3 sm:w-auto"
                            onClick={handleSaveSettings}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setIsSettingsOpen(false)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

