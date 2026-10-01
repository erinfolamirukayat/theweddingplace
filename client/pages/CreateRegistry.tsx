import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HeartIcon,
  SaveIcon,
  CalendarIcon,
  AlertCircleIcon,
  XIcon,
  ArrowLeftIcon,
  ImageIcon,
} from "lucide-react";
import {
  createRegistry as apiCreateRegistry,
  addRegistryPicture,
  uploadImageFile,
  uploadImageFromUrl,
} from "../utils/api";
import { useNotification } from "../components/Layout";
import StoryBuilder from "../components/StoryBuilder";

const MAX_IMAGES = 10;

const CreateRegistry = () => {
  const navigate = useNavigate();
  const { setMessage } = useNotification();
  const [formData, setFormData] = useState({
    bride_first_name: "",
    bride_last_name: "",
    groom_first_name: "",
    groom_last_name: "",
    wedding_date: "",
    story: "",
    fulfillment_preference: "cash_immediate",
    post_wedding_date: "",
    bank_name: "",
    account_name: "",
    account_number: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userFields, setUserFields] = useState({
    phone: "",
    wedding_city: "",
  });

  const [imageSourceType, setImageSourceType] = useState<
    "none" | "file" | "url"
  >("none");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleUserFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrl) {
      setErrors((prev) => ({ ...prev, imageUrl: "Please enter an image URL" }));
      return;
    }
    if (imageUrls.length >= MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: `Maximum ${MAX_IMAGES} images allowed`,
      }));
      return;
    }
    try {
      new URL(imageUrl);
      setImageUrls((prev) => [...prev, imageUrl]);
      setImageUrl("");
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.imageUrl;
        return updated;
      });
    } catch {
      setErrors((prev) => ({ ...prev, imageUrl: "Please enter a valid URL" }));
    }
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalFiles = imageFiles.length + files.length;
      if (totalFiles > MAX_IMAGES) {
        setErrors((prev) => ({
          ...prev,
          file: `You can only upload a maximum of ${MAX_IMAGES} files.`,
        }));
        // Optionally, only take enough files to reach the limit
        const remainingSlots = MAX_IMAGES - imageFiles.length;
        setImageFiles((prev) => [...prev, ...files.slice(0, remainingSlots)]);
      } else {
        setImageFiles((prev) => [...prev, ...files]);
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bride_first_name.trim())
      newErrors.bride_first_name = "Bride first name is required";
    if (!formData.groom_first_name.trim())
      newErrors.groom_first_name = "Groom first name is required";
    if (!formData.wedding_date)
      newErrors.wedding_date = "Wedding date is required";
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
      if (imageSourceType === "file") {
        for (const file of imageFiles) {
          const data = await uploadImageFile(file);
          finalImageUrls.push(data.url);
        }
      } else if (imageSourceType === "url") {
        // For each user-provided URL, ask the backend to fetch it and store it in our Supabase bucket.
        for (const imageUrl of imageUrls) {
          const data = await uploadImageFromUrl(imageUrl);
          finalImageUrls.push(data.url);
        }
      }
      // Create the registry first (without pictures)
      const registry = await apiCreateRegistry({
        couple_names: `${[formData.bride_first_name.trim(), formData.bride_last_name.trim()].filter(Boolean).join(" ")} & ${[formData.groom_first_name.trim(), formData.groom_last_name.trim()].filter(Boolean).join(" ")}`,
        wedding_date: formData.wedding_date,
        story: formData.story,
        phone: userFields.phone,
        wedding_city: userFields.wedding_city,
      });
      // Add each picture to the registry
      for (const url of finalImageUrls) {
        await addRegistryPicture(registry.uuid, url);
      }
      localStorage.setItem("afriwed_registry_id", registry.uuid);
      setMessage("Registry created successfully!", "success");
      navigate(`/registry/${registry.uuid}`);
    } catch (err: any) {
      setApiError(err.message || "Failed to create registry");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          <div className="bg-[#ECDFD7] px-6 py-10 sm:px-12 text-center border-b border-[#E8DCC4]/50">
            <HeartIcon className="h-12 w-12 text-[#B8860B] mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810]">
              Create Your Registry
            </h1>
            <p className="mt-2 text-gray-600 font-medium">
              Let's set up your beautiful wedding registry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-12 space-y-8">
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  The Couple
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="bride_first_name"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Bride First Name
                    </label>
                    <input
                      type="text"
                      name="bride_first_name"
                      id="bride_first_name"
                      value={formData.bride_first_name}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${errors.bride_first_name ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all`}
                      placeholder="e.g. Amaka"
                    />
                    {errors.bride_first_name && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">
                        {errors.bride_first_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="bride_last_name"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Bride Last Name
                    </label>
                    <input
                      type="text"
                      name="bride_last_name"
                      id="bride_last_name"
                      value={formData.bride_last_name}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${errors.bride_last_name ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all`}
                      placeholder="e.g. Okafor"
                    />
                    {errors.bride_last_name && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">
                        {errors.bride_last_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="groom_first_name"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Groom First Name
                    </label>
                    <input
                      type="text"
                      name="groom_first_name"
                      id="groom_first_name"
                      value={formData.groom_first_name}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${errors.groom_first_name ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all`}
                      placeholder="e.g. Chinedu"
                    />
                    {errors.groom_first_name && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">
                        {errors.groom_first_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="groom_last_name"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Groom Last Name
                    </label>
                    <input
                      type="text"
                      name="groom_last_name"
                      id="groom_last_name"
                      value={formData.groom_last_name}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${errors.groom_last_name ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all`}
                      placeholder="e.g. Eze"
                    />
                    {errors.groom_last_name && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">
                        {errors.groom_last_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Wedding Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="wedding_date"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Wedding Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="wedding_date"
                        id="wedding_date"
                        value={formData.wedding_date}
                        onChange={handleChange}
                        className={`block w-full pl-11 pr-4 py-3 border ${errors.wedding_date ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all`}
                      />
                    </div>
                    {errors.wedding_date && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">
                        {errors.wedding_date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City of Ceremony (Optional)
                    </label>
                    <input
                      type="text"
                      name="wedding_city"
                      value={userFields.wedding_city}
                      onChange={handleUserFieldChange}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all"
                      placeholder="e.g. Lagos"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      WhatsApp Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userFields.phone}
                      onChange={handleUserFieldChange}
                      className={`block w-full px-4 py-3 border ${errors.phone ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all`}
                        placeholder="+234..."
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-[#B8860B]" />
                  Wedding Pictures
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <select
                    value={imageSourceType}
                    onChange={(e) =>
                      setImageSourceType(
                        e.target.value as "none" | "file" | "url",
                      )
                    }
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] bg-white font-medium text-gray-700 mb-4"
                  >
                    <option value="none">I'll add pictures later</option>
                    <option value="file">Upload from my device</option>
                    <option value="url">
                      Add from web links (e.g., Google Drive)
                    </option>
                  </select>

                  {imageSourceType === "file" && (
                    <div className="mt-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Upload Files (up to {MAX_IMAGES})
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:font-bold file:bg-[#B8860B] file:text-white hover:file:bg-[#8B6508] transition-colors cursor-pointer bg-white border border-gray-200 rounded-xl"
                        disabled={imageFiles.length >= MAX_IMAGES}
                      />
                      {errors.file && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          {errors.file}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-4">
                        {imageFiles.map((file, idx) => (
                          <div key={idx} className="relative w-24 h-24 group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-xl shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {imageSourceType === "url" && (
                    <div className="mt-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Add Image URLs (up to {MAX_IMAGES})
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="block flex-1 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                          placeholder="Paste image URL here"
                          disabled={imageUrls.length >= MAX_IMAGES}
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-6 py-3 bg-[#2C1810] text-white font-bold rounded-xl hover:bg-black transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!imageUrl || imageUrls.length >= MAX_IMAGES}
                        >
                          Add
                        </button>
                      </div>
                      {errors.imageUrl && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          {errors.imageUrl}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-4">
                        {imageUrls.map((url, idx) => (
                          <div key={idx} className="relative w-24 h-24 group">
                            <img
                              src={url}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-xl shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveUrl(idx)}
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              
            {/* Fulfillment Preferences */}
            <div className="pt-10 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-2">Gift Fulfillment Preference</h2>
              <p className="text-gray-500 mb-6">How would you like to receive your gifts from the registry?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { id: 'cash_immediate', title: 'Immediate Cash Payout', desc: 'Receive funds as soon as they are gifted' },
                  { id: 'cash_post_wedding', title: 'Cash Payout After Wedding', desc: 'Receive a lump sum on a specific date' },
                  { id: 'delivery', title: 'Physical Delivery', desc: 'We deliver physical items to your address' },
                  { id: 'both', title: 'Both', desc: 'A mix of cash payouts and physical delivery' }
                ].map(opt => (
                  <label key={opt.id} className={`relative flex cursor-pointer rounded-2xl border p-4 shadow-sm focus:outline-none ${formData.fulfillment_preference === opt.id ? 'border-[#B8860B] bg-[#B8860B]/5 ring-1 ring-[#B8860B]' : 'border-gray-300 bg-white hover:border-gray-400'}`}>
                    <input type="radio" name="fulfillment_preference" value={opt.id} checked={formData.fulfillment_preference === opt.id} onChange={handleChange} className="sr-only" />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-bold text-gray-900">{opt.title}</span>
                        <span className="mt-1 flex items-center text-sm text-gray-500">{opt.desc}</span>
                      </span>
                    </span>
                    <HeartIcon className={`h-5 w-5 ${formData.fulfillment_preference === opt.id ? 'text-[#B8860B]' : 'text-transparent'}`} />
                  </label>
                ))}
              </div>

              {formData.fulfillment_preference === 'cash_post_wedding' && (
                <div className="mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Payout Date</label>
                  <input type="date" name="post_wedding_date" value={formData.post_wedding_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-[#B8860B] focus:border-[#B8860B]" />
                </div>
              )}

              {(formData.fulfillment_preference === 'delivery' || formData.fulfillment_preference === 'both') && (
                <div className="mb-6 bg-[#ECDFD7]/30 text-[#8B6508] p-4 rounded-xl flex items-start border border-[#B8860B]/20">
                  <HeartIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">You have selected a physical delivery option! A dedicated Celebrive representative will contact you to coordinate the delivery of your gifts.</span>
                </div>
              )}

              {(formData.fulfillment_preference === 'cash_immediate' || formData.fulfillment_preference === 'cash_post_wedding' || formData.fulfillment_preference === 'both') && (
                <div className="mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Bank Details for Cash Payout (Optional)</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder="e.g. Chase Bank" className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-[#B8860B] focus:border-[#B8860B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} placeholder="e.g. John Doe" className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-[#B8860B] focus:border-[#B8860B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} placeholder="e.g. 1234567890" className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-[#B8860B] focus:border-[#B8860B]" />
                  </div>
                  <p className="text-sm text-gray-500 italic mt-2">
                    * You can provide this information at any time. We will send you a reminder when your selected payout date approaches.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="story"

                  className="block text-xl font-bold text-gray-900 mb-4"
                >
                  Our Love Story (Optional)
                </label>
                <div className="mb-6">
                  <StoryBuilder
                    onApply={(storyText) =>
                      setFormData((prev) => ({ ...prev, story: storyText }))
                    }
                  />
                </div>
                <textarea
                  name="story"
                  id="story"
                  value={formData.story}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all"
                  rows={6}
                  placeholder="Share your beautiful journey together... Or use the AI builder above to help you write it!"
                />
              </div>
            </div>

            {apiError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-100">
                <AlertCircleIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-medium">{apiError}</span>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-[#B8860B] text-white font-bold rounded-xl shadow-lg hover:bg-[#8B6508] hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                disabled={loading || uploading}
              >
                <SaveIcon className="h-5 w-5 mr-2" />
                {loading ? "Creating Registry..." : "Create Registry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRegistry;


