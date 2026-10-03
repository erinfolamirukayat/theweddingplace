import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  PlusIcon,
  ExternalLinkIcon,
  SettingsIcon,
  GiftIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "lucide-react";
import {
  getRegistryById as apiGetRegistryById,
  getProducts,
  getRegistryPictures,
  updateRegistry as apiUpdateRegistry,
  getRegistryItems,
  addRegistryPicture,
  removeRegistryPicture,
} from "../utils/api";
import { uploadImageFileToCloudinary } from "../utils/cloudinary";
import { Dialog, DialogPanel, DialogTitle , Transition } from "@headlessui/react";
import {
  XIcon,
  PencilIcon,
  ImageIcon,
} from "lucide-react";
import { useNotification } from "../components/Layout";
import StoryBuilder from "../components/StoryBuilder";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  suggested_amount: number;
}

interface RegistryItem {
  id: number;
  product_id: number;
  quantity: number;
  contributions_received: number;
  is_fully_funded: boolean;
  created_at: string;
}

const RegistryView = () => {
  const { uuid: id } = useParams<{ uuid: string }>();
  const [registry, setRegistry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pictures, setPictures] = useState<string[]>([]);
  const [showPicturesModal, setShowPicturesModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pictureToDelete, setPictureToDelete] = useState<string | null>(null);
  const { setMessage } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      apiGetRegistryById(id)
        .then((reg) => {
          setRegistry(reg);
          fetchItems(reg.uuid);
          fetchPictures();
        })
        .catch((err) => setError(err.message || "Failed to load registry"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const fetchItems = async (registryId: string) => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const data = await getRegistryItems(registryId);
      setItems(data);
      // Optionally fetch products for display
      const prods = await getProducts();
      setProducts(prods);
    } catch (err: any) {
      setItemsError(err.message || "Failed to load items");
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchPictures = async () => {
    try {
      const data = await getRegistryPictures(id || "");
      setPictures(data.map((pic: any) => pic.image_url || ""));
    } catch (err: any) {
      console.error("Failed to load pictures:", err);
    }
  };

  const handleShare = () => {
    if (registry?.share_slug) {
      const shareLink = `${window.location.origin}/${registry.share_slug}`;
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const data = await uploadImageFileToCloudinary(file);

        // Save image URL to backend
        await addRegistryPicture(id!, data.url);
        setMessage("Picture uploaded successfully!");

        // Refresh pictures
        fetchPictures();
      } catch (err: any) {
        setMessage(err.message || "Failed to upload picture");
      } finally {
        setUploading(false);
      }
    }
  };

  const confirmDeletePicture = async () => {
    if (!pictureToDelete) return;
    try {
      await removeRegistryPicture(id!, pictureToDelete);
      setMessage("Picture deleted successfully!");
      fetchPictures();
    } catch (err: any) {
      setMessage(err.message || "Failed to delete picture");
    } finally {
      setDeleteConfirmOpen(false);
      setPictureToDelete(null);
    }
  };

  const handleUpdateRegistry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiUpdateRegistry(id!, editForm);
      setRegistry({ ...registry, ...editForm });
      setEditOpen(false);
      setMessage("Registry updated successfully");
    } catch (err: any) {
      setMessage(err.message || "Failed to update registry");
    }
  };

  // Separate items into two categories
  const openItems = items.filter((item) => !item.is_fully_funded);
  const fullyFundedItems = items.filter((item) => item.is_fully_funded);

  const renderItem = (item: any, isFullyFunded: boolean) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) return null;
    const total = product.price * item.quantity;
    const remaining = Math.max(total - item.contributions_received, 0);
    const progress = (item.contributions_received / total) * 100;

    return (
      <div
        key={item.id}
        className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all hover:border-[#E8DCC4] relative overflow-hidden"
      >
        <div className="w-full sm:w-28 h-40 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFullyFunded && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
              <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Funded
              </div>
            </div>
          )}
        </div>

        <div className="flex-grow w-full">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
            
          </div>

          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {product.description}
          </p>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              <span>Qty: {item.quantity}</span>
              <span
                className={isFullyFunded ? "text-green-600" : "text-[#B8860B]"}
              >
                ₦{Number(item.contributions_received).toLocaleString()} / ₦{total.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${
                  isFullyFunded ? "bg-green-500" : "bg-[#B8860B]"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B]"></div>
      </div>
    );
  }

  if (error || !registry) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <HeartIcon className="w-16 h-16 text-gray-300 mb-4" />
        <div className="text-xl font-bold text-gray-900 mb-2">Error</div>
        <div className="text-gray-500">{error || "Registry not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Registry Management Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#ECDFD7] px-6 py-10 sm:p-12 text-center border-b border-[#E8DCC4]/50 relative">
            <HeartIcon className="h-10 w-10 text-[#B8860B] mx-auto mb-4 opacity-50" />
          <div className="flex items-center justify-center mb-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] mr-4">
              {registry.couple_names}
            </h1>
            <button
              onClick={() => {
                setEditForm(registry);
                setEditOpen(true);
              }}
              className="p-2 bg-white rounded-full text-[#B8860B] hover:bg-[#FDFBF7] shadow-sm border border-[#E8DCC4] transition-colors"
              title="Edit Registry"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
            <div className="flex items-center justify-center text-[#B8860B] font-medium mb-8">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {registry.wedding_date ? (
                <span>
                  {new Date(registry.wedding_date).toLocaleDateString(
                    undefined,
                    { dateStyle: "long" },
                  )}
                </span>
              ) : (
                <span className="italic opacity-70">Date not set</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowPicturesModal(true)}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white border-2 border-[#E8DCC4] text-[#B8860B] font-semibold rounded-xl hover:bg-[#FDFBF7] transition-colors shadow-sm"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Manage Pictures
              </button>
              <button
                onClick={handleShare}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white border-2 border-[#E8DCC4] text-[#B8860B] font-semibold rounded-xl hover:bg-[#FDFBF7] transition-colors shadow-sm"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy Public Link"}
              </button>

              <Link
                to={`/${registry.share_slug}`}
                target="_blank"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl hover:bg-[#8B6508] transition-colors shadow-sm"
              >
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                View Public Registry
              </Link>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Build Your Wishlist
              </h2>
              <p className="text-sm text-gray-500">
                Browse our catalog and add gifts you'd love to receive.
              </p>
            </div>
            <Link
              to="/catalog"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-[#2C1810] text-white font-semibold rounded-xl hover:bg-black transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Items
            </Link>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="space-y-12">
          {/* Open Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Active Items
              <span className="ml-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {openItems.length}
              </span>
            </h2>

            {openItems.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <GiftIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Your registry is empty
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Start building your dream home by adding gifts to your
                  registry.
                </p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openItems.map((item) => renderItem(item, false))}
              </div>
            )}
          </div>

          {/* Fully Funded Items Section */}
          {fullyFundedItems.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                Fully Funded
                <span className="ml-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                  {fullyFundedItems.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80 grayscale-[0.3]">
                {fullyFundedItems.map((item) => renderItem(item, true))}
              </div>
            </div>
          )}
        </div>

        {/* Note about how it works */}
        <div className="bg-[#ECDFD7] border border-[#E8DCC4] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B8860B] mr-4">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#2C1810]">
              How Your Registry Works
            </h3>
          </div>
          <ul className="text-sm text-gray-700 space-y-3 list-disc pl-14">
            <li>
              <strong>Flexible Contributions:</strong> Guests can fully fund or
              partially contribute to any item. Prices shown are estimates.
            </li>
            <li>
              <strong>Physical Delivery:</strong> You can choose to have fully
              or partially funded items delivered to your home on your selected
              date. A Celebrive rep will work with you to finalize the list.
            </li>
            <li>
              <strong>Cash Options:</strong> Prefer cash? You can easily
              withdraw from your available registry balance at any time.
            </li>
          </ul>
          <div className="mt-6 pl-14">
            <Link
              to="/how-it-works"
              className="inline-flex items-center text-sm font-bold text-[#B8860B] hover:text-[#8B6508] group"
            >
              Read more about how it works
              <ArrowLeftIcon className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Registry Modal */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <DialogPanel className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full mx-auto p-6 sm:p-8 z-20 text-left overflow-hidden">
            <DialogTitle
              as="h3"
              className="text-xl font-bold text-gray-900 mb-6"
            >
              Edit Registry Details
            </DialogTitle>
            <form onSubmit={handleUpdateRegistry} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Couple Names
                </label>
                <input
                  type="text"
                  value={editForm.couple_names || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      couple_names: e.target.value,
                    })
                  }
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={editForm.wedding_date?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      wedding_date: e.target.value,
                    })
                  }
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                />
              </div>
              
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City of Ceremony (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.wedding_city || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        wedding_city: e.target.value,
                      })
                    }
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    WhatsApp Phone Number (Optional)</label><input type="text" value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: e.target.value,
                      })
                    }
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                  />
                </div>
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Story
                </label>
                <StoryBuilder
                  onApply={(storyText) =>
                    setEditForm({ ...editForm, story: storyText })
                  }
                />
                <textarea
                  value={editForm.story || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, story: e.target.value })
                  }
                  rows={4}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] mt-2"
                />
              </div>
              
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Manage Pictures Modal */}
      <Dialog
        open={showPicturesModal}
        onClose={() => setShowPicturesModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <DialogPanel className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full mx-auto p-6 sm:p-8 z-20 text-left overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <DialogTitle as="h3" className="text-xl font-bold text-gray-900">
                Manage Wedding Pictures
              </DialogTitle>
              <button onClick={() => setShowPicturesModal(false)}>
                <XIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Add New Picture
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-semibold file:bg-[#B8860B]/10 file:text-[#B8860B] hover:file:bg-[#B8860B]/20 transition-colors border border-gray-200 rounded-xl disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {pictures.map((picUrl, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={picUrl}
                    alt="Wedding"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        setPictureToDelete(picUrl);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Delete Picture Confirmation Modal */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <DialogPanel className="relative bg-white rounded-3xl shadow-xl max-w-sm w-full mx-auto p-6 sm:p-8 z-20 text-left overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>

            <DialogTitle
              as="h3"
              className="text-xl font-bold text-gray-900 mb-2"
            >
              Remove Picture?
            </DialogTitle>
            <div className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to remove this picture from your registry?
              This action cannot be undone.
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                onClick={confirmDeletePicture}
              >
                Yes, Remove Picture
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default RegistryView;



