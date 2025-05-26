import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CalendarIcon, GiftIcon, HeartIcon, ShareIcon, PencilIcon } from 'lucide-react';
import { getRegistryById as apiGetRegistryById, getProducts, getRegistryPictures, addRegistryPicture, removeRegistryPicture, updateRegistry as apiUpdateRegistry } from '../utils/api';
import { Dialog } from '@headlessui/react';
import { XIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNotification } from '../components/Layout';

const RegistryView = () => {
  const { id } = useParams<{ id: string }>();
  const [registry, setRegistry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
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
          // Fetch registry items
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
      const res = await fetch(`http://localhost:5000/api/registries/${registryId}/items`);
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
    if (registry?.share_url) {
      const shareLink = `${window.location.origin}/share/${registry.share_url}`;
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

  const handleReplacePicture = async (index: number) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const res = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      const newUrl = data.url;
      await removeRegistryPicture(id || '', pictures[index] || '');
      await addRegistryPicture(id || '', newUrl);
      setPictures(prev => prev.map((url, i) => i === index ? newUrl : url));
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Failed to replace picture:', err);
    }
  };

  const handleDeletePicture = async (index: number) => {
    try {
      await removeRegistryPicture(id || '', pictures[index] || '');
      setPictures(prev => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      console.error('Failed to delete picture:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>;
  }
  if (!registry) {
    return <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Registry not found
          </h2>
          <p className="mt-1 text-gray-500">
            This registry may have been removed or is private
          </p>
          <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]">
            Return Home
          </Link>
        </div>
      </div>;
  }

  return <div className="max-w-4xl mx-auto">
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
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#2C1810]">Registry Items</h2>
            <button
              className="inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] text-sm"
              onClick={() => navigate(`/catalog?registry=${registry.id}`)}
            >
              + Add Item
            </button>
          </div>
          {/* Modal for adding item */}
          <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
              <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6 z-20">
                <Dialog.Title className="text-lg font-semibold mb-4">Add Item to Registry</Dialog.Title>
                {addError && <div className="text-red-600 mb-2">{addError}</div>}
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    setAddLoading(true);
                    setAddError(null);
                    try {
                      const res = await fetch(`http://localhost:5000/api/registries/${registry.id}/items`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ product_id: selectedProductId, quantity }),
                      });
                      if (!res.ok) throw new Error('Failed to add item');
                      setShowAddModal(false);
                      setSelectedProductId('');
                      setQuantity(1);
                      fetchItems(registry.id);
                    } catch (err: any) {
                      setAddError(err.message || 'Failed to add item');
                    } finally {
                      setAddLoading(false);
                    }
                  }}
                >
                  <label className="block mb-2 text-sm font-medium">Product</label>
                  <select
                    className="w-full border rounded px-3 py-2 mb-4"
                    value={selectedProductId}
                    onChange={e => setSelectedProductId(e.target.value)}
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <label className="block mb-2 text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border rounded px-3 py-2 mb-4"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() => setShowAddModal(false)}
                      disabled={addLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-[#B8860B] text-white hover:bg-[#8B6508]"
                      disabled={addLoading}
                    >
                      {addLoading ? 'Adding...' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog>
          {itemsLoading ? (
            <div className="text-center py-8">Loading items...</div>
          ) : itemsError ? (
            <div className="text-center text-red-600 py-8">{itemsError}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No items yet</h3>
              <p className="mt-1 text-gray-500">The couple hasn't added any items to their registry yet</p>
              <Link 
                to={`/catalog?registry=${registry.id}`} 
                className="mt-4 inline-flex items-center px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {items.map((item: any) => {
                const product = products.find((p: any) => p.id === item.product_id);
                if (!product) return null;
                const totalPrice = product.price * item.quantity;
                const progress = item.contributions_received / totalPrice * 100;
                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2C1810]">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        <div className="mt-2 text-sm"><span className="font-semibold">Quantity:</span> <span className="font-semibold">{item.quantity}</span></div>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>
                              ₦{item.contributions_received.toLocaleString()} of ₦{totalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#B8860B] rounded-full h-2" style={{ width: `${Math.min(progress, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-6">
            <button
              onClick={() => setShowPicturesModal(true)}
              className="px-4 py-2 bg-[#B8860B] text-white rounded"
            >
              View Pictures
            </button>
          </div>
        </div>
      </div>
      <Dialog open={showPicturesModal} onClose={() => setShowPicturesModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Panel className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-auto p-6 z-20">
            <Dialog.Title className="text-lg font-semibold mb-4">Registry Pictures</Dialog.Title>
            <div className="grid grid-cols-3 gap-4">
              {pictures && pictures.length > 0 ? pictures.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url || ''}
                    alt={`Registry ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleDeletePicture(index)}
                      className="p-1 bg-red-500 text-white rounded"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500" />
                    <button
                      onClick={() => handleReplacePicture(index)}
                      className="mt-1 px-2 py-1 bg-[#B8860B] text-white rounded text-sm"
                      disabled={!selectedFile}
                    >
                      Replace
                    </button>
                  </div>
                </div>
              )) : <div className="col-span-3 text-center text-gray-500">No pictures available.</div>}
            </div>
            <button
              onClick={() => setShowPicturesModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6 z-20">
            <Dialog.Title className="text-lg font-semibold mb-4">Edit Registry Details</Dialog.Title>
            <form onSubmit={async e => {
              e.preventDefault();
              try {
                const updated = await apiUpdateRegistry(registry.id, editForm);
                setRegistry(updated);
                setEditOpen(false);
                setMessage('Registry updated successfully!');
              } catch (err: any) {
                setMessage(err.message || 'Update failed');
              }
            }}>
              <label className="block mb-2 font-medium">Couple Names</label>
              <input type="text" className="w-full border rounded px-3 py-2 mb-4" value={editForm.couple_names || ''} onChange={e => setEditForm((f: any) => ({ ...f, couple_names: e.target.value }))} required />
              <label className="block mb-2 font-medium">Wedding Date</label>
              <input type="date" className="w-full border rounded px-3 py-2 mb-4" value={editForm.wedding_date ? editForm.wedding_date.slice(0,10) : ''} onChange={e => setEditForm((f: any) => ({ ...f, wedding_date: e.target.value }))} required />
              <label className="block mb-2 font-medium">Story</label>
              <textarea className="w-full border rounded px-3 py-2 mb-4" value={editForm.story || ''} onChange={e => setEditForm((f: any) => ({ ...f, story: e.target.value }))} rows={3} />
              <label className="block mb-2 font-medium">WhatsApp Phone Number</label>
              <input type="tel" className="w-full border rounded px-3 py-2 mb-4" value={editForm.phone || ''} onChange={e => setEditForm((f: any) => ({ ...f, phone: e.target.value }))} required />
              <label className="block mb-2 font-medium">City of Wedding Ceremony</label>
              <input type="text" className="w-full border rounded px-3 py-2 mb-4" value={editForm.wedding_city || ''} onChange={e => setEditForm((f: any) => ({ ...f, wedding_city: e.target.value }))} />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">Save</button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>;
};

export default RegistryView;