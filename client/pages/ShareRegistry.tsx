import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRegistryByShareUrl, getRegistryPictures } from "../utils/api";
import { Dialog } from "@headlessui/react";
import {
  HeartIcon,
  GiftIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "lucide-react";
import { getConfig } from "../config";

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

const ShareRegistry = () => {
  const { shareUrl } = useParams<{ shareUrl: string }>();
  const [registry, setRegistry] = useState<any>(null);
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pictures, setPictures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPicturesModal, setShowPicturesModal] = useState(false);
  const navigate = useNavigate();
  const MIN_CONTRIB = 1000;

  useEffect(() => {
    if (shareUrl) {
      console.log("Fetching registry", shareUrl);
      fetchRegistryByShareUrl(shareUrl);
    }
  }, [shareUrl]);

  const fetchRegistryByShareUrl = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const reg = await getRegistryByShareUrl(url);
      setRegistry(reg);
      const pics = await getRegistryPictures(reg.uuid);
      setPictures(pics.map((pic: any) => pic.image_url));
      // Fetch registry items
      const itemsRes = await fetch(
        `${getConfig().apiUrl}/registries/${reg.uuid}/items`,
      );
      if (!itemsRes.ok) throw new Error("Failed to fetch items");
      const itemsData = await itemsRes.json();
      setItems(itemsData); // Store all items without filtering
      // Fetch products
      const prodsRes = await fetch(`${getConfig().apiUrl}/products`);
      const prods = await prodsRes.json();
      setProducts(prods);
    } catch (err: any) {
      setError(err.message || "Failed to load registry");
    } finally {
      setLoading(false);
    }
  };

  const handleContributeClick = (item: RegistryItem, product: Product) => {
    navigate(`/${shareUrl}/contribute/${item.id}`);
  };

  // Separate items into two categories
  const openItems = items.filter((item) => !item.is_fully_funded);
  const fullyFundedItems = items.filter((item) => item.is_fully_funded);

  const renderItem = (item: RegistryItem, isFullyFunded: boolean) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) return null;
    const total = product.price * item.quantity;
    const remaining = Math.max(total - item.contributions_received, 0);
    const progress = (item.contributions_received / total) * 100;

    return (
      <div
        key={item.id}
        className="group bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all hover:border-[#E8DCC4]"
      >
        <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFullyFunded && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Funded
              </div>
            </div>
          )}
        </div>
        <div className="flex-grow w-full text-center sm:text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              <span>Progress</span>
              <span
                className={isFullyFunded ? "text-green-600" : "text-[#B8860B]"}
              >
                ₦{Number(item.contributions_received).toLocaleString()} / ₦{total.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${
                  isFullyFunded ? "bg-green-500" : "bg-[#B8860B]"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto flex-shrink-0">
          {isFullyFunded ? (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed"
            >
              Completed
            </button>
          ) : (
            <button
              onClick={() => navigate(`/${shareUrl}/contribute/${item.id}`)}
              className="w-full sm:w-auto px-6 py-3 bg-[#B8860B] text-white rounded-xl font-semibold shadow-sm hover:bg-[#8B6508] transition-colors flex items-center justify-center"
            >
              Contribute
            </button>
          )}
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
        <div className="text-xl font-bold text-gray-900 mb-2">Oops!</div>
        <div className="text-gray-500">{error || "Registry not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-16">
      {/* Hero Header Block */}
      <div className="bg-white border-b border-[#E8DCC4] shadow-sm mb-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-[#ECDFD7] border border-[#E8DCC4] text-[#B8860B] text-xs font-bold uppercase tracking-widest shadow-sm">
              <HeartIcon className="w-3.5 h-3.5 mr-1.5" /> Wedding Registry
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C1810] tracking-tight mb-4 leading-tight">
              {registry.couple_names}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-gray-500 font-medium text-lg">
              {registry.wedding_date && (
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  {new Date(registry.wedding_date).toLocaleDateString(
                    undefined,
                    { dateStyle: "long" },
                  )}
                </div>
              )}
            </div>

            {registry.story && (
              <div className="mt-8 relative max-w-2xl mx-auto md:mx-0 bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-600 text-base leading-relaxed line-clamp-3 italic">
                  "{registry.story}"
                </p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => setShowPicturesModal(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#B8860B] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center">
                {pictures.length > 0
                  ? "View Gallery & Story"
                  : "Read Our Story"}
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wedding Pictures Mini Gallery Section */}
        {pictures.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <HeartIcon className="w-6 h-6 mr-2 text-[#B8860B]" />
                Sneak Peek
              </h2>
              <button
                onClick={() => setShowPicturesModal(true)}
                className="text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] bg-[#ECDFD7] px-4 py-2 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {pictures.slice(0, 3).map((url, index) => (
                <div
                  key={index}
                  className={`relative group overflow-hidden rounded-2xl aspect-[4/5] ${index === 2 ? "hidden md:block" : ""}`}
                >
                  <img
                    src={url}
                    alt={`Wedding ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registry Items Sections */}
        <div className="space-y-12">
          {/* Open Items Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Our Wishlist
            </h2>
            <p className="text-gray-500 mb-8">
              Help us turn our dream home into a reality.
            </p>

            {openItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <GiftIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  All items have been fully funded! Thank you!
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {openItems.map((item) => renderItem(item, false))}
              </div>
            )}
          </div>

          {/* Fully Funded Items Section */}
          {fullyFundedItems.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                Fully Funded
                <span className="ml-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  {fullyFundedItems.length}
                </span>
              </h2>
              <div className="grid gap-4 sm:gap-6 opacity-75 grayscale-[0.2]">
                {fullyFundedItems.map((item) => renderItem(item, true))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Details & Photos Modal */}
      <Dialog
        open={showPicturesModal}
        onClose={() => setShowPicturesModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <Dialog.Panel className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-auto z-20 my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex-shrink-0 border-b border-gray-100 px-6 sm:px-8 py-5 flex items-center justify-between bg-white rounded-t-3xl sticky top-0 z-30">
              <Dialog.Title
                as="h3"
                className="text-xl sm:text-2xl font-bold text-gray-900"
              >
                The Details
              </Dialog.Title>
              <button
                type="button"
                className="bg-gray-100 rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-200 transition-colors"
                onClick={() => setShowPicturesModal(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50/50 text-left">
              {/* Love Story Section */}
              {registry.story && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-[#B8860B] uppercase tracking-widest mb-4 flex items-center">
                    <HeartIcon className="w-4 h-4 mr-2" /> Our Love Story
                  </h3>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium">
                      {registry.story}
                    </p>
                  </div>
                </div>
              )}

              {/* Event Details Section */}
              {registry.wedding_date && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-[#B8860B] uppercase tracking-widest mb-4 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" /> Wedding Details
                  </h3>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {registry.wedding_date && (
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            When
                          </div>
                          <div className="text-gray-900 font-medium">
                            {new Date(registry.wedding_date).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Full Gallery Section */}
              {pictures.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#B8860B] uppercase tracking-widest mb-4">
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pictures.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 group"
                      >
                        <img
                          src={url}
                          alt={`Wedding ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 border-t border-gray-100 px-6 sm:px-8 py-5 bg-white rounded-b-3xl">
              <button
                className="w-full px-6 py-4 bg-[#B8860B] text-white font-semibold rounded-xl hover:bg-[#8B6508] transition-colors shadow-sm"
                onClick={() => setShowPicturesModal(false)}
              >
                Back to Registry
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ShareRegistry;
