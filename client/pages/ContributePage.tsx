import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRegistryByShareUrl, getRegistryPictures } from '../utils/api';
import { getConfig } from '../config';

const MIN_CONTRIB = 1000;

const ContributePage = () => {
  const { shareUrl, itemId } = useParams();
  const navigate = useNavigate();
  const [registry, setRegistry] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contributeAmount, setContributeAmount] = useState<number | string>(MIN_CONTRIB);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!shareUrl || !itemId) {
          setError('Invalid link.');
          setLoading(false);
          return;
        }
        const reg = await getRegistryByShareUrl(shareUrl);
        setRegistry(reg);
        const itemsRes = await fetch(`${getConfig().apiUrl}/registries/${reg.id}/items`);
        const itemsData = await itemsRes.json();
        const foundItem = itemsData.find((it: any) => String(it.id) === String(itemId));
        setItem(foundItem);
        const prodsRes = await fetch(`${getConfig().apiUrl}/products`);
        const prods = await prodsRes.json();
        setProducts(prods);
        const prod = prods.find((p: any) => p.id === foundItem.product_id);
        setProduct(prod);
        if (foundItem && prod) {
          const total = prod.price * foundItem.quantity;
          const remaining = Math.max(total - foundItem.contributions_received, 0);
          setContributeAmount(remaining);
        }
      } catch (err: any) {
        setError('Could not load contribution info.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shareUrl, itemId]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error || !item || !product) return <div className="flex justify-center items-center h-64 text-red-600">{error || 'Item not found.'}</div>;

  const total = product.price * item.quantity;
  const remaining = Math.max(total - item.contributions_received, 0);
  const min = MIN_CONTRIB;
  const max = remaining;
  const percent = contributeAmount === '' || total === 0 ? 0 : Math.round((Number(contributeAmount) / total) * 100);

  const handleAmountChange = (value: number | string, fromSlider = false) => {
    if (fromSlider) {
      setContributeAmount(Math.max(min, Math.min(max, Number(value))));
    } else {
      setContributeAmount(value);
    }
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setFormError('Please enter your email.');
      return;
    }
    if (!contributeAmount || Number(contributeAmount) < 5000) {
      setFormError('Contribution amount must be at least ₦5,000.');
      return;
    }
    setFormError(null);
    try {
      const res = await fetch(`${getConfig().apiUrl}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registry_item_id: item.id,
          name,
          email,
          amount: Number(contributeAmount),
          message
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || 'Failed to submit contribution.');
        return;
      }
      setSuccess(true);
    } catch (err) {
      setFormError('Failed to submit contribution.');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-[#2C1810]">Thank you for your contribution!</h2>
        <p className="mb-4">Your gift will mean a lot to the couple.</p>
        <button className="px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]" onClick={() => navigate(-1)}>Back to Registry</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#2C1810]">Contribute to Gift</h2>
      <div className="mb-2 font-medium text-gray-900">{product.name}</div>
      <div className="mb-2 text-gray-600 text-sm">Amount remaining: ₦{remaining.toLocaleString()}</div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name <span className="text-red-600">*</span></label>
          <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Your Email <span className="text-red-600">*</span></label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="text-xs text-gray-500 mb-2">This helps the couple know who contributed to their registry.</div>
        <div>
          <label className="block text-sm font-medium mb-1">Contribution Amount <span className="text-red-600">*</span></label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              min={min}
              max={max}
              value={contributeAmount}
              onChange={e => handleAmountChange(e.target.value)}
              className="w-32 border rounded px-3 py-2"
              required
            />
            <span className="text-gray-600">₦</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={contributeAmount === '' ? min : Math.max(min, Math.min(max, Number(contributeAmount)))}
            onChange={e => handleAmountChange(e.target.value, true)}
            className="w-full mb-2"
          />
          <div className="mb-2 text-xs text-gray-500">You can change the amount to contribute by entering a new amount above or by moving this slider</div>
          <div className="mb-4 text-sm text-gray-700">You are contributing <span className="font-semibold">₦{contributeAmount === '' ? 0 : Number(contributeAmount).toLocaleString()}</span> ({percent}%)</div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message to the couple (optional)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="Write a message to the couple..."
          />
        </div>
        {formError && <div className="mb-2 text-xs text-red-600">{formError}</div>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-[#B8860B] text-white hover:bg-[#8B6508]">Contribute</button>
        </div>
      </form>
    </div>
  );
};

export default ContributePage; 