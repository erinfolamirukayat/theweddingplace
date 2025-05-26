import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GiftIcon, PlusIcon, TrashIcon, CheckIcon, ShoppingCartIcon, ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';
import { getPersonById, getGiftOptionsForPerson, addGiftOption, updateGiftOption, deleteGiftOption, generateId, GiftOption } from '../utils/storage';
const GiftManagement = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [giftOptions, setGiftOptions] = useState<GiftOption[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGift, setNewGift] = useState({
    productName: '',
    productUrl: '',
    price: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (id) {
      const foundPerson = getPersonById(id);
      if (foundPerson) {
        setPerson(foundPerson);
        const gifts = getGiftOptionsForPerson(id);
        setGiftOptions(gifts);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);
  const handleGiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setNewGift(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const updated = {
          ...prev
        };
        delete updated[name];
        return updated;
      });
    }
  };
  const validateGiftForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newGift.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!newGift.productUrl.trim()) {
      newErrors.productUrl = 'Product URL is required';
    } else if (!newGift.productUrl.startsWith('http')) {
      newErrors.productUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    if (!newGift.price.trim()) {
      newErrors.price = 'Price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateGiftForm() && id) {
      const currentYear = new Date().getFullYear();
      const newGiftOption: GiftOption = {
        id: generateId(),
        personId: id,
        year: currentYear,
        productName: newGift.productName,
        productUrl: newGift.productUrl,
        price: newGift.price,
        isSelected: false,
        isPurchased: false
      };
      addGiftOption(newGiftOption);
      setGiftOptions(prev => [...prev, newGiftOption]);
      setNewGift({
        productName: '',
        productUrl: '',
        price: ''
      });
      setShowAddForm(false);
    }
  };
  const handleDeleteGift = (giftId: string) => {
    if (window.confirm('Are you sure you want to delete this gift option?')) {
      deleteGiftOption(giftId);
      setGiftOptions(prev => prev.filter(gift => gift.id !== giftId));
    }
  };
  const toggleGiftSelected = (gift: GiftOption) => {
    const updatedGift = {
      ...gift,
      isSelected: !gift.isSelected
    };
    updateGiftOption(updatedGift);
    setGiftOptions(prev => prev.map(g => g.id === gift.id ? updatedGift : g));
  };
  const toggleGiftPurchased = (gift: GiftOption) => {
    const updatedGift = {
      ...gift,
      isPurchased: !gift.isPurchased
    };
    updateGiftOption(updatedGift);
    setGiftOptions(prev => prev.map(g => g.id === gift.id ? updatedGift : g));
  };
  if (!person) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  return <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to={`/person/${id}`} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to {person.name}
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Gift Options for {person.name}
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {giftOptions.length === 0 && !showAddForm ? <div className="text-center py-8">
            <GiftIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No gift options yet
            </h3>
            <p className="mt-1 text-gray-500">
              Add gift options to send to {person.name}
            </p>
            <button onClick={() => setShowAddForm(true)} className="mt-4 flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 mx-auto">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Gift Option
            </button>
          </div> : <>
            {!showAddForm && <button onClick={() => setShowAddForm(true)} className="mb-6 flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Gift Option
              </button>}
            {showAddForm && <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Gift Option
                </h3>
                <form onSubmit={handleAddGift}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <input type="text" name="productName" id="productName" value={newGift.productName} onChange={handleGiftChange} className={`mt-1 block w-full border ${errors.productName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} placeholder="e.g. Wireless Headphones" />
                      {errors.productName && <p className="mt-1 text-sm text-red-600">
                          {errors.productName}
                        </p>}
                    </div>
                    <div>
                      <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700">
                        Product URL
                      </label>
                      <input type="text" name="productUrl" id="productUrl" value={newGift.productUrl} onChange={handleGiftChange} className={`mt-1 block w-full border ${errors.productUrl ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} placeholder="https://example.com/product" />
                      {errors.productUrl && <p className="mt-1 text-sm text-red-600">
                          {errors.productUrl}
                        </p>}
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input type="text" name="price" id="price" value={newGift.price} onChange={handleGiftChange} className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} placeholder="$29.99" />
                      {errors.price && <p className="mt-1 text-sm text-red-600">
                          {errors.price}
                        </p>}
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        Add Gift
                      </button>
                    </div>
                  </div>
                </form>
              </div>}
            {giftOptions.length > 0 && <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Current Gift Options
                </h3>
                <ul className="divide-y divide-gray-200">
                  {giftOptions.map(gift => <li key={gift.id} className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-medium text-gray-900 truncate">
                            {gift.productName}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {gift.price}
                          </p>
                          <a href={gift.productUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                            View product{' '}
                            <ExternalLinkIcon className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => toggleGiftSelected(gift)} className={`flex items-center p-1.5 rounded-md ${gift.isSelected ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={gift.isSelected ? 'Selected by recipient' : 'Mark as selected'}>
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => toggleGiftPurchased(gift)} className={`flex items-center p-1.5 rounded-md ${gift.isPurchased ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={gift.isPurchased ? 'Purchased' : 'Mark as purchased'}>
                            <ShoppingCartIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteGift(gift.id)} className="flex items-center p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200" title="Delete gift option">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        {gift.isSelected && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Selected
                          </span>}
                        {gift.isPurchased && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Purchased
                          </span>}
                      </div>
                    </li>)}
                </ul>
              </div>}
          </>}
      </div>
    </div>;
};
export default GiftManagement;