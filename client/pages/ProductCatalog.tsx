import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { getProducts } from '../utils/api';
import { Dialog } from '@headlessui/react';
import { getConfig } from '../config';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  suggested_amount: number;
}

const ProductCatalog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryRegistryId = searchParams.get('registry');
  const localRegistryId = localStorage.getItem('afriwed_registry_id');
  const effectiveRegistryId = queryRegistryId || localRegistryId;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToRegistry, setAddingToRegistry] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const PRODUCTS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    if (effectiveRegistryId) {
      fetchRegistryItems(effectiveRegistryId);
    }
  }, [effectiveRegistryId]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistryItems = async (regId: string) => {
    try {
      const response = await fetch(`${getConfig().apiUrl}/registries/${regId}/items`);
      if (!response.ok) throw new Error('Failed to fetch registry items');
      const items = await response.json();
      setAddedItems(new Set(items.map((item: any) => item.product_id)));
    } catch (err: any) {
      console.error('Error fetching registry items:', err);
    }
  };

  const handleAddToRegistry = (product: Product) => {
    if (!user) {
      navigate('/login', { state: { from: '/catalog' } });
      return;
    }
    setSelectedProduct(product);
    setQuantity(1);
    setShowQuantityModal(true);
  };

  const confirmAddToRegistry = async () => {
    if (!selectedProduct) return;
    const latestRegistryId = effectiveRegistryId;
    if (!latestRegistryId) {
      navigate('/create-registry');
      return;
    }
    setAddingToRegistry(selectedProduct.id);
    setError(null);
    try {
      const response = await fetch(`${getConfig().apiUrl}/registries/${latestRegistryId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: selectedProduct.id, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add item to registry');
      setSuccessMessage('Item added to registry successfully!');
      setAddedItems(prev => new Set([...prev, selectedProduct.id]));
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowQuantityModal(false);
      setSelectedProduct(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add item to registry');
    } finally {
      setAddingToRegistry(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="group">
            <div className="relative w-full h-64">
              <img
                src={product.image_url}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center rounded-lg"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">₦{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
            <button
              onClick={() => handleAddToRegistry(product)}
              disabled={addingToRegistry === product.id || addedItems.has(product.id)}
              className={`mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                ${addingToRegistry === product.id || addedItems.has(product.id)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#B8860B] hover:bg-[#8B6508]'
                }`}
            >
              {addingToRegistry === product.id 
                ? 'Adding...' 
                : addedItems.has(product.id)
                  ? 'Added to Registry'
                  : 'Add to Registry'
              }
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Quantity Modal */}
      <Dialog open={showQuantityModal} onClose={() => setShowQuantityModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Panel className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mx-auto p-6 z-20">
            <Dialog.Title className="text-lg font-semibold mb-4">Add to Registry</Dialog.Title>
            {selectedProduct && (
              <div>
                <div className="mb-4">
                  <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                  <div className="text-gray-500 text-sm">{selectedProduct.category}</div>
                </div>
                <label className="block mb-2 text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full border rounded px-3 py-2 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowQuantityModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAddToRegistry}
                    className="px-4 py-2 rounded bg-[#B8860B] text-white hover:bg-[#8B6508]"
                    disabled={addingToRegistry === selectedProduct.id}
                  >
                    {addingToRegistry === selectedProduct.id ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductCatalog;