import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRegistryByShareUrl, getRegistryPictures } from '../utils/api';
import { Dialog } from '@headlessui/react';
import { getConfig } from '../config';

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
      console.log('Fetching registry', shareUrl);
      fetchRegistryByShareUrl(shareUrl);
    }
  }, [shareUrl]);

  const fetchRegistryByShareUrl = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const reg = await getRegistryByShareUrl(url);
      setRegistry(reg);
      const pics = await getRegistryPictures(reg.id);
      setPictures(pics.map((pic: any) => pic.image_url));
      // Fetch registry items
      const itemsRes = await fetch(`${getConfig().apiUrl}/registries/${reg.id}/items`);
      if (!itemsRes.ok) throw new Error('Failed to fetch items');
      const itemsData = await itemsRes.json();
      setItems(itemsData); // Store all items without filtering
      // Fetch products
      const prodsRes = await fetch(`${getConfig().apiUrl}/products`);
      const prods = await prodsRes.json();
      setProducts(prods);
    } catch (err: any) {
      setError(err.message || 'Failed to load registry');
    } finally {
      setLoading(false);
    }
  };

  const handleContributeClick = (item: RegistryItem, product: Product) => {
    navigate(`/share/${shareUrl}/contribute/${item.id}`);
  };

  // Separate items into two categories
  const openItems = items.filter(item => !item.is_fully_funded);
  const fullyFundedItems = items.filter(item => item.is_fully_funded);

  const renderItem = (item: RegistryItem, isFullyFunded: boolean) => {
    const product = products.find(p => p.id === item.product_id);
    if (!product) return null;
    const total = product.price * item.quantity;
    const remaining = Math.max(total - item.contributions_received, 0);
    const progress = (item.contributions_received / total) * 100;

    return (
      <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
        <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
        <div className="flex-grow">
          <h3 className="font-semibold text-[#2C1810]">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          <div className="mt-2 text-sm">
            <span className="font-semibold">Quantity:</span>{' '}
            <span className="font-semibold">{item.quantity}</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>₦{item.contributions_received.toLocaleString()} of ₦{total.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`rounded-full h-2 ${isFullyFunded ? 'bg-green-500' : 'bg-[#B8860B]'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          {!isFullyFunded && remaining > 0 && (
            <button
              className="ml-4 mt-3 px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]"
              onClick={() => handleContributeClick(item, product)}
            >
              Contribute
            </button>
          )}
          {isFullyFunded && (
            <div className="ml-4 mt-3 px-4 py-2 bg-gray-100 text-gray-500 rounded-md inline-block">
              Fully Funded
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error || !registry) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Failed to load registry'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Block */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810] mb-1">{registry.couple_names}'s Registry</h1>
          <p className="text-sm text-gray-500">Welcome to our wedding gift registry!</p>
        </div>
        <button
          onClick={() => setShowPicturesModal(true)}
          className="text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] border border-[#B8860B] px-4 py-2 rounded-md hover:bg-[#FFF8F3] transition-colors self-start sm:self-auto"
        >
          View Story & Wedding Details
        </button>
      </div>

      {/* Wedding Pictures Section */}
      {pictures.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#2C1810]">Wedding Gallery</h2>
            <button
              onClick={() => setShowPicturesModal(true)}
              className="text-sm text-[#B8860B] hover:underline font-medium"
            >
              View Full Gallery & Story &rarr;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pictures.slice(0, 2).map((url, index) => (
              <img key={index} src={url} alt={`Wedding ${index + 1}`} className="w-full h-72 object-contain bg-gray-50 border border-gray-100 rounded-lg shadow-sm" />
            ))}
          </div>
        </div>
      )}

      {/* Custom Details & Photos Modal */}
      <Dialog open={showPicturesModal} onClose={() => setShowPicturesModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="fixed inset-0 bg-black opacity-45" />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto p-6 sm:p-8 z-20 max-h-[85vh] overflow-y-auto">
            {/* Header Info */}
            <div className="border-b border-gray-100 pb-4 mb-5">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-2">{registry.couple_names}</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mt-2">
                {registry.wedding_date && (
                  <div>
                    <span className="font-semibold text-gray-700">Wedding Date:</span>{' '}
                    {new Date(registry.wedding_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </div>
                )}
                {registry.wedding_city && (
                  <div>
                    <span className="font-semibold text-gray-700">Venue / Location:</span>{' '}
                    {registry.wedding_city}
                  </div>
                )}
              </div>
            </div>

            {/* Love Story Section */}
            {registry.story && (
              <div className="mb-6 bg-[#FFF8F3] p-4 rounded-lg border border-[#FDF2E9]">
                <h3 className="font-semibold text-[#B8860B] mb-1.5 text-sm uppercase tracking-wide">Our Love Story</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{registry.story}</p>
              </div>
            )}

            {/* Full Photo Gallery */}
            {pictures.length > 0 && (
              <div>
                <h3 className="font-semibold text-[#2C1810] mb-3 text-sm uppercase tracking-wide">Wedding Photo Gallery</h3>
                <div className="grid grid-cols-2 gap-4">
                  {pictures.map((url, index) => (
                    <img key={index} src={url} alt={`Wedding ${index + 1}`} className="w-full h-64 object-contain bg-gray-50 border border-gray-100 rounded-lg shadow-sm" />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowPicturesModal(false)}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#2C1810] mb-4">Registry Items (Open for Contribution)</h2>
        {openItems.length === 0 ? (
          <div className="text-center text-gray-500">All items have been fully funded!</div>
        ) : (
          <div className="grid gap-6">
            {openItems.map(item => renderItem(item, false))}
          </div>
        )}
      </div>
      {fullyFundedItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#2C1810] mb-4">Fully Funded Items</h2>
          <div className="grid gap-6">
            {fullyFundedItems.map(item => renderItem(item, true))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareRegistry; 