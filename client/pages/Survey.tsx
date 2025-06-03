import React, { useState } from 'react';

const BANNER_IMAGE =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80'; // Couple image from Unsplash

type FormData = {
  name: string;
  email: string;
  age_range: string;
  relationship_status: string;
  wedding_planning_status: string;
  received_unwanted_gifts: string;
  known_registry_platforms: string;
  registry_usefulness: string;
  would_use_platform: string;
  desired_gifts: string;
  preferred_shopping_method: string;
  other_shopping_method: string;
  desired_features: string;
  open_to_conversation: string;
  contact_info: string;
};

const Survey = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    age_range: '',
    relationship_status: '',
    wedding_planning_status: '',
    received_unwanted_gifts: '',
    known_registry_platforms: '',
    registry_usefulness: '',
    would_use_platform: '',
    desired_gifts: '',
    preferred_shopping_method: '',
    other_shopping_method: '',
    desired_features: '',
    open_to_conversation: '',
    contact_info: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPages = 4;
  const progress = (currentPage / totalPages) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit survey');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">About You</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">What is your name?</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age range</label>
              <select
                name="age_range"
                value={form.age_range}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select age range</option>
                <option value="Under 20">Under 20</option>
                <option value="20-25">20-25</option>
                <option value="26-30">26-30</option>
                <option value="31-35">31-35</option>
                <option value="36-40">36-40</option>
                <option value="40+">40+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Are you currently in a relationship?</label>
              <select
                name="relationship_status"
                value={form.relationship_status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="It's complicated">It's complicated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Are you engaged or planning to get married in the next 2 years?</label>
              <select
                name="wedding_planning_status"
                value={form.wedding_planning_status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">Gift-Giving Experience</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Have you ever received wedding gifts that you didn't really need or want?</label>
              <select
                name="received_unwanted_gifts"
                value={form.received_unwanted_gifts}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="I haven't had a wedding yet">I haven't had a wedding yet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Do you know of any existing platforms in Nigeria that help couples create a wedding registry?</label>
              <textarea
                name="known_registry_platforms"
                value={form.known_registry_platforms}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                placeholder="Please list any platforms you know of..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">Interest in BlissGifts</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">If you were getting married, how useful would a wedding registry be to you?</label>
              <select
                name="registry_usefulness"
                value={form.registry_usefulness}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select option</option>
                <option value="Extremely useful">Extremely useful</option>
                <option value="Somewhat useful">Somewhat useful</option>
                <option value="Not very useful">Not very useful</option>
                <option value="Not useful at all">Not useful at all</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Would you use a Nigerian wedding registry platform that allows you to select your dream home items?</label>
              <select
                name="would_use_platform"
                value={form.would_use_platform}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select option</option>
                <option value="Yes, definitely">Yes, definitely</option>
                <option value="Maybe">Maybe</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">What kind of gifts would you want to add to your wedding registry?</label>
              <textarea
                name="desired_gifts"
                value={form.desired_gifts}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                placeholder="e.g., kitchen appliances, furniture, cash gifts, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">How would you prefer your guests to shop from your registry?</label>
              <select
                name="preferred_shopping_method"
                value={form.preferred_shopping_method}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select option</option>
                <option value="Via a link shared with them">Via a link shared with them</option>
                <option value="Embedded in your wedding website">Embedded in your wedding website</option>
                <option value="WhatsApp broadcast or DM">WhatsApp broadcast or DM</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {form.preferred_shopping_method === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Please specify:</label>
                <input
                  type="text"
                  name="other_shopping_method"
                  value={form.other_shopping_method}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">What features would make you more likely to use a platform like this?</label>
              <textarea
                name="desired_features"
                value={form.desired_features}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                placeholder="Please share your thoughts..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-4">Let's Talk</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Would you be open to a short (20-minute) online conversation to help us understand your needs better?</label>
              <select
                name="open_to_conversation"
                value={form.open_to_conversation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="Maybe">Maybe</option>
                <option value="No">No</option>
              </select>
            </div>
            {(form.open_to_conversation === 'Yes' || form.open_to_conversation === 'Maybe') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Please drop your WhatsApp number or Instagram handle (or both):</label>
                <input
                  type="text"
                  name="contact_info"
                  value={form.contact_info}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                  placeholder="e.g., +234 123 456 7890 or @username"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-center py-8 bg-white shadow">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#B8860B] tracking-tight">BlissGifts</h1>
      </header>
      {/* Banner */}
      <div
        className="w-full h-64 sm:h-80 bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow mb-2">
            Help Shape the Future of Wedding Gifts
          </h2>
          <p className="text-lg text-white drop-shadow">
            Share your thoughts and help us create a better gift-giving experience
          </p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="max-w-xl mx-auto mt-8 px-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#B8860B] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      {/* Survey Form */}
      <div className="max-w-xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-8">
        {submitted ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[#2C1810] mb-2">Thank you!</h3>
            <p className="text-gray-700">Your feedback has been received. We'll keep you posted on how BlissGifts is evolving!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderPage()}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex justify-between mt-8">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={prevPage}
                  className="px-6 py-2 border border-[#B8860B] text-[#B8860B] rounded-md hover:bg-[#B8860B] hover:text-white transition-colors"
                >
                  Previous
                </button>
              )}
              {currentPage < totalPages ? (
                <button
                  type="button"
                  onClick={nextPage}
                  className="ml-auto px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
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