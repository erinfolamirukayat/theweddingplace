import React, { useState } from 'react';
import { getConfig } from '../config';

const BANNER_IMAGE =
  'https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-misc-images//new-weds5.png'; // Couple image from Unsplash

type FormData = {
  name: string;
  email: string;
  relationship_status: string;
  given_gift: string;
  received_unwanted_gift: string;
  gift_ease: string;
  would_use_registry: string;
  share_link_method: string[];
  culture_show_gift: string;
  culture_associate_gift: string;
  open_to_conversation: string;
  phone_number?: string;
};

const Survey = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    relationship_status: '',
    given_gift: '',
    received_unwanted_gift: '',
    gift_ease: '',
    would_use_registry: '',
    share_link_method: [],
    culture_show_gift: '',
    culture_associate_gift: '',
    open_to_conversation: '',
    phone_number: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const totalPages = 4;
  const progress = (currentPage / totalPages) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'share_link_method' && type === 'checkbox') {
      const input = e.target as HTMLInputElement;
      const checked = input.checked;
      setForm((prev) => {
        const arr = Array.isArray(prev.share_link_method) ? prev.share_link_method : [];
        if (checked) {
          return { ...prev, share_link_method: [...arr, value] };
        } else {
          return { ...prev, share_link_method: arr.filter((v) => v !== value) };
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting survey data:', form);
      const response = await fetch(`${getConfig().apiUrl}/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Survey submission failed:', errorData);
        throw new Error(errorData.error || 'Failed to submit survey');
      }

      const data = await response.json();
      console.log('Survey submission response:', data);
      setSubmitted(true);
    } catch (err) {
      console.error('Survey submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit survey');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    let missing: string[] = [];
    if (currentPage === 1) {
      if (!form.name) missing.push('name');
      if (!form.relationship_status) missing.push('relationship_status');
    }
    if (currentPage === 2) {
      if (!form.given_gift) missing.push('given_gift');
      if (!form.received_unwanted_gift) missing.push('received_unwanted_gift');
      if (!form.gift_ease) missing.push('gift_ease');
    }
    if (currentPage === 3) {
      if (!form.would_use_registry) missing.push('would_use_registry');
      if (form.would_use_registry === 'Yes' && form.share_link_method.length === 0) missing.push('share_link_method');
      if (!form.culture_show_gift) missing.push('culture_show_gift');
    }
    if (currentPage === 4) {
      if (!form.open_to_conversation) missing.push('open_to_conversation');
      if (form.open_to_conversation === 'Yes' && !form.phone_number) missing.push('phone_number');
    }
    if (missing.length > 0) {
      setError('Please fill in all required fields.');
      setMissingFields(missing);
      return;
    }
    setError('');
    setMissingFields([]);
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-[#FFFBDE] border-l-4 border-[#129990] p-4 rounded mb-4">
              <div className="font-bold text-[#129990] text-lg mb-1">BlissGifts is an online wedding gift registry designed specifically for Nigerian couples.</div>
              <div className="mb-2 text-[#2C1810] font-medium">Why is this important?</div>
              <div className="text-[#2C1810] mb-2">Because right now, most Nigerian couples receive random wedding gifts — sometimes duplicates, sometimes things they don't need — and then have to carry everything home from the venue. 😩</div>
              <ul className="list-none pl-0 text-[#2C1810] space-y-1">
                <li>✅ Couples can choose exactly what they need (TV, cash, fridge, etc.)</li>
                <li>✅ Guests buy straight from the couple's list — no guesswork</li>
                <li>✅ No bulky items to move from the venue</li>
                <li>✅ Everything is delivered or sent directly to the couple</li>
                <li>✅ It's simple, beautiful, and stress-free!</li>
              </ul>
            </div>
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">About You</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name<span className="text-red-600">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('name') ? 'border-red-500' : ''}`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Please tell us your relationship status?<span className="text-red-600">*</span></label>
              <select
                name="relationship_status"
                value={form.relationship_status}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('relationship_status') ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select option</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="In a relationship ready to marry in 2 years">In a relationship ready to marry in 2 years</option>
                <option value="In a relationship not ready to marry">In a relationship not ready to marry</option>
                <option value="Divorced">Divorced</option>
                <option value="Not willing to disclose">Not willing to disclose</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">Gift-Giving Experience</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Have you ever given a wedding gift to anyone in Nigeria?<span className="text-red-600">*</span></label>
              <select
                name="given_gift"
                value={form.given_gift}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('given_gift') ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select option</option>
                <option value="Yes, I bought a physical gift">Yes, I bought a physical gift</option>
                <option value="Yes, I gave cash gift">Yes, I gave cash gift</option>
                <option value="Yes, both physical and cash gifts">Yes, both physical and cash gifts</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Have you ever received a wedding gift that you did not need or want?<span className="text-red-600">*</span></label>
              <select
                name="received_unwanted_gift"
                value={form.received_unwanted_gift}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('received_unwanted_gift') ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes, not a good experience</option>
                <option value="No">No, I haven't received any unwanted gifts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">As someone who has given/or would give wedding gifts to people, which of the following is the easiest for you?<span className="text-red-600">*</span></label>
              <select
                name="gift_ease"
                value={form.gift_ease}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('gift_ease') ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select option</option>
                <option value="Giving cash gift">Giving cash gift</option>
                <option value="Buying and giving physical gifts">Buying and giving physical gifts</option>
                <option value="Ask the couple for what they prefer">Ask the couple for what they prefer</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">Registry & Culture</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">If you were getting married, would you choose to use a wedding registry platform that lets you select the items you need?<span className="text-red-600">*</span></label>
              <select
                name="would_use_registry"
                value={form.would_use_registry}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('would_use_registry') ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes, definitely</option>
                <option value="No">No, I'd rather not</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">If you choose to use an online gift registry, how would you share the link with loved ones? (Select all that apply)<span className="text-red-600">*</span></label>
              <div className="flex flex-col gap-2 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="share_link_method"
                    value="As part of my wedding invitation message"
                    checked={form.share_link_method.includes('As part of my wedding invitation message')}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-[#B8860B]"
                  />
                  <span className="ml-2">As part of my wedding invitation message</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="share_link_method"
                    value="Printed as a QR code on my invitation card"
                    checked={form.share_link_method.includes('Printed as a QR code on my invitation card')}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-[#B8860B]"
                  />
                  <span className="ml-2">Printed as a QR code on my invitation card</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="share_link_method"
                    value="On the whatsapp groups I belong to"
                    checked={form.share_link_method.includes('On the whatsapp groups I belong to')}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-[#B8860B]"
                  />
                  <span className="ml-2">On the whatsapp groups I belong to</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Do you have a culture that necessitates wedding guests to show their gifts at the wedding venue to access certain things at the wedding?<span className="text-red-600">*</span></label>
              <select
                name="culture_show_gift"
                value={form.culture_show_gift}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('culture_show_gift') ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">If you picked yes above, will it be sufficient to provide a means to associate a wedding guest with the gift they paid for or the amount they contributed towards a gift?</label>
              <select
                name="culture_associate_gift"
                value={form.culture_associate_gift}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">Let's Talk</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Would you be open to a short (20-minute) online conversation to help us understand your needs better?<span className="text-red-600">*</span></label>
              <select
                name="open_to_conversation"
                value={form.open_to_conversation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('open_to_conversation') ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {form.open_to_conversation === 'Yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone number<span className="text-red-600">*</span></label>
                <input
                  type="text"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] ${missingFields.includes('phone_number') ? 'border-red-500' : ''}`}
                  placeholder="e.g., +234 123 456 7890"
                  required
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-0">
      {/* Header */}
      <header className="text-center py-6 sm:py-8 bg-white shadow">
        <h1 className="text-2xl sm:text-4xl font-bold text-[#B8860B] tracking-tight">BlissGifts</h1>
      </header>
      {/* Banner */}
      <div
        className="w-full h-40 sm:h-64 sm:h-80 bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${BANNER_IMAGE})`, backgroundPosition: 'center 20%' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center">
          <h2 className="text-lg sm:text-3xl font-bold text-white drop-shadow mb-2">
            Help Shape the Future of Wedding Gifts
          </h2>
          <p className="text-base sm:text-lg text-white drop-shadow">
            Share your thoughts and help us create a better gift-giving experience
          </p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="max-w-xl mx-auto mt-6 sm:mt-8 px-2 sm:px-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#B8860B] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      {/* Survey Form */}
      <div className="max-w-xl mx-auto mt-6 sm:mt-8 bg-white rounded-lg shadow-lg p-4 sm:p-8">
        {submitted ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[#2C1810] mb-2">Thank you!</h3>
            <p className="text-gray-700">Your feedback has been received. We'll keep you posted on how BlissGifts is evolving!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderPage()}
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6 sm:mt-8">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={prevPage}
                  className="w-full sm:w-auto px-6 py-2 border border-[#B8860B] text-[#B8860B] rounded-md hover:bg-[#B8860B] hover:text-white transition-colors"
                >
                  Previous
                </button>
              )}
              {currentPage < totalPages ? (
                <button
                  type="button"
                  onClick={nextPage}
                  className="w-full sm:w-auto px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Survey'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Survey; 