import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRegistryByShareUrl, getRegistryPictures } from '../utils/api';
import { Dialog } from '@headlessui/react';

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
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributeItem, setContributeItem] = useState<RegistryItem | null>(null);
  const [contributeAmount, setContributeAmount] = useState(1000);
  const MIN_CONTRIB = 1000;

  useEffect(() => {
    if (shareUrl) {
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
      const itemsRes = await fetch(`http://localhost:5000/api/registries/${reg.id}/items`);
      if (!itemsRes.ok) throw new Error('Failed to fetch items');
      const itemsData = await itemsRes.json();
      setItems(itemsData.filter((item: RegistryItem) => !item.is_fully_funded));
      // Fetch products
      const prodsRes = await fetch('http://localhost:5000/api/products');
      const prods = await prodsRes.json();
      setProducts(prods);
    } catch (err: any) {
      setError(err.message || 'Failed to load registry');
    } finally {
      setLoading(false);
    }
  };

  const handleContributeClick = (item: RegistryItem, product: Product) => {
    setContributeItem(item);
    const total = product.price * item.quantity;
    const remaining = Math.max(total - item.contributions_received, MIN_CONTRIB);
    setContributeAmount(remaining); // Default to 100% of remaining
    setShowContributeModal(true);
  };

  const handleAmountChange = (value: number, min: number, max: number) => {
    setContributeAmount(Math.max(min, Math.min(max, value)));
  };

  const handleContribute = () => {
    // Placeholder for backend integration
    alert(`Contributed ₦${contributeAmount} to item ${contributeItem?.id}`);
    setShowContributeModal(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>;
  }
  if (!registry) {
    return <div className="flex justify-center items-center h-64">Registry not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-[#2C1810] mb-2">{registry.couple_names}'s Registry</h1>
        <p className="text-gray-600 mb-2">Wedding Date: {new Date(registry.wedding_date).toLocaleDateString()}</p>
        {registry.story && <p className="text-gray-500 mb-4">{registry.story}</p>}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#2C1810] mb-2">Wedding Pictures</h2>
        <div className="grid grid-cols-3 gap-4">
          {pictures.slice(0, 3).map((url, index) => (
            <img key={index} src={url} alt={`Wedding ${index + 1}`} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
        {pictures.length > 3 && (
          <button
            onClick={() => setShowPicturesModal(true)}
            className="mt-2 px-4 py-2 bg-[#B8860B] text-white rounded"
          >
            View All Pictures
          </button>
        )}
      </div>
      <Dialog open={showPicturesModal} onClose={() => setShowPicturesModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-auto p-6 z-20">
            <Dialog.Title className="text-lg font-semibold mb-4">All Wedding Pictures</Dialog.Title>
            <div className="grid grid-cols-3 gap-4">
              {pictures.map((url, index) => (
                <img key={index} src={url} alt={`Wedding ${index + 1}`} className="w-full h-48 object-cover rounded" />
              ))}
            </div>
            <button
              onClick={() => setShowPicturesModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#2C1810] mb-4">Registry Items (Open for Contribution)</h2>
        {items.length === 0 ? (
          <div className="text-center text-gray-500">All items have been fully funded!</div>
        ) : (
          <div className="grid gap-6">
            {items.map(item => {
              const product = products.find(p => p.id === item.product_id);
              if (!product) return null;
              const total = product.price * item.quantity;
              const remaining = Math.max(total - item.contributions_received, 0);
              const progress = item.contributions_received / total * 100;
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
                  <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2C1810]">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    <div className="mt-2 text-sm"><span className="font-semibold">Quantity:</span> <span className="font-semibold">{item.quantity}</span></div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>₦{item.contributions_received.toLocaleString()} of ₦{total.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#B8860B] rounded-full h-2" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                    </div>
                    {remaining > 0 && (
                      <button
                        className="ml-4 mt-3 px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]"
                        onClick={() => handleContributeClick(item, product)}
                      >
                        Contribute
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Contribute Modal */}
      <Dialog open={showContributeModal} onClose={() => setShowContributeModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Panel className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mx-auto p-6 z-20">
            <Dialog.Title className="text-lg font-semibold mb-4">Contribute to Gift</Dialog.Title>
            {contributeItem && (() => {
              const product = products.find(p => p.id === contributeItem.product_id);
              if (!product) return null;
              const total = product.price * contributeItem.quantity;
              const min = MIN_CONTRIB;
              const max = total - contributeItem.contributions_received;
              const percent = Math.round((contributeAmount / total) * 100);
              return (
                <div>
                  <div className="mb-2 font-medium text-gray-900">{product.name}</div>
                  <div className="mb-2 text-gray-600 text-sm">Total: ₦{total.toLocaleString()}</div>
                  <div className="mb-2 text-gray-600 text-sm">Already contributed: ₦{contributeItem.contributions_received.toLocaleString()}</div>
                  <div className="mb-2 text-gray-600 text-sm">Amount remaining: ₦{(total - contributeItem.contributions_received).toLocaleString()}</div>
                  <label className="block mb-2 text-sm font-medium">Contribution Amount</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="number"
                      min={min}
                      max={max}
                      value={contributeAmount}
                      onChange={e => handleAmountChange(Number(e.target.value), min, max)}
                      className="w-32 border rounded px-3 py-2"
                    />
                    <span className="text-gray-600">₦</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={contributeAmount}
                    onChange={e => handleAmountChange(Number(e.target.value), min, max)}
                    className="w-full mb-2"
                  />
                  <div className="mb-4 text-sm text-gray-700">You are contributing <span className="font-semibold">₦{contributeAmount.toLocaleString()}</span> ({percent}%)</div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowContributeModal(false)}
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleContribute}
                      className="px-4 py-2 rounded bg-[#B8860B] text-white hover:bg-[#8B6508]"
                      disabled={contributeAmount < min || contributeAmount > max}
                    >
                      Contribute
                    </button>
                  </div>
                </div>
              );
            })()}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ShareRegistry; 