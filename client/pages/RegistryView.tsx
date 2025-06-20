import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CalendarIcon, GiftIcon, HeartIcon, ShareIcon, PencilIcon } from 'lucide-react';
import { getRegistryById as apiGetRegistryById, getProducts, getRegistryPictures, addRegistryPicture, removeRegistryPicture, updateRegistry as apiUpdateRegistry } from '../utils/api';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNotification } from '../components/Layout';
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

const RegistryView = () => {
  const { id } = useParams<{ id: string }>();
  const [registry, setRegistry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [pictures, setPictures] = useState<string[]>([]);
  const [showPicturesModal, setShowPicturesModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const { setMessage } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      apiGetRegistryById(id)
        .then(reg => {
          setRegistry(reg);
          fetchItems(reg.id);
          fetchPictures();
        })
        .catch(err => setError(err.message || 'Failed to load registry'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const fetchItems = async (registryId: string) => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      // Fetch registry items from backend
      const res = await fetch(`${getConfig().apiUrl}/registries/${registryId}/items`);
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      setItems(data);
      // Optionally fetch products for display
      const prods = await getProducts();
      setProducts(prods);
    } catch (err: any) {
      setItemsError(err.message || 'Failed to load items');
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchPictures = async () => {
    try {
      const data = await getRegistryPictures(id || '');
      setPictures(data.map((pic: any) => pic.image_url || ''));
    } catch (err: any) {
      console.error('Failed to load pictures:', err);
    }
  };

  const handleShare = () => {
    if (registry?.share_slug) {
      const shareLink = `${window.location.origin}/share/${registry.share_slug}`;
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdateRegistry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiUpdateRegistry(id!, editForm);
      setRegistry({ ...registry, ...editForm });
      setEditOpen(false);
      setMessage('Registry updated successfully');
    } catch (err: any) {
      setMessage(err.message || 'Failed to update registry');
    }
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
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              ₦{remaining.toLocaleString()} remaining
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registry details...</p>
        </div>
      </div>
    );
  }

  if (error || !registry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Registry not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-[#FFF8F3]">
          <div className="text-center">
            <HeartIcon className="h-12 w-12 text-[#B8860B] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#2C1810] mb-2">
              {registry.couple_names}
            </h1>
            <div className="flex items-center justify-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <p>
                Wedding Date:{' '}
                {new Date(registry.wedding_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center justify-center mt-6">
              {registry.story && <p className="text-gray-600 max-w-2xl mx-auto">{registry.story}</p>}
              <button className="ml-2 text-[#B8860B] hover:text-[#8B6508]" onClick={() => { setEditForm(registry); setEditOpen(true); }}>
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            <button onClick={handleShare} className="mt-6 inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]">
              <ShareIcon className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Share Registry'}
            </button>
          </div>
        </div>

        {/* Edit Registry Modal */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" />
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6">
              <Dialog.Title className="text-lg font-semibold mb-4">Edit Registry Details</Dialog.Title>
              <form onSubmit={handleUpdateRegistry}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Couple Names</label>
                    <input
                      type="text"
                      value={editForm.couple_names || ''}
                      onChange={e => setEditForm({ ...editForm, couple_names: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wedding Date</label>
                    <input
                      type="date"
                      value={editForm.wedding_date?.split('T')[0] || ''}
                      onChange={e => setEditForm({ ...editForm, wedding_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Story</label>
                    <textarea
                      value={editForm.story || ''}
                      onChange={e => setEditForm({ ...editForm, story: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>

        {/* Registry Items Sections */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#2C1810]">Registry Items</h2>
            <button
              className="inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] text-sm"
              onClick={() => navigate(`/catalog?registry=${registry.id}`)}
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Item
            </button>
          </div>

          {itemsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8860B] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading items...</p>
            </div>
          ) : itemsError ? (
            <div className="text-center text-red-600 py-8">{itemsError}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No items yet</h3>
              <p className="mt-1 text-gray-500">Start by adding items to your registry</p>
              <Link 
                to={`/catalog?registry=${registry.id}`} 
                className="mt-4 inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Open Items Section */}
              <div className="bg-white rounded-lg">
                <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Items Open for Contribution</h3>
                {openItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">All items have been fully funded!</div>
                ) : (
                  <div className="grid gap-6">
                    {openItems.map(item => renderItem(item, false))}
                  </div>
                )}
              </div>

              {/* Fully Funded Items Section */}
              {fullyFundedItems.length > 0 && (
                <div className="bg-white rounded-lg">
                  <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Fully Funded Items</h3>
                  <div className="grid gap-6">
                    {fullyFundedItems.map(item => renderItem(item, true))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistryView;