import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalItems: 0,
    fullyContributed: 0,
    partiallyContributed: 0,
    delivered: 0,
    totalContributed: 0,
  });
  const [details, setDetails] = useState({
    couple_names: 'Ada and Chinedu',
    phone: '',
    wedding_city: '',
    story: 'He was my music director in fellowship',
    messageToGifters: 'Thank You',
    wedding_date: '2025-05-23',
    photos: [],
  });
  const [redemption, setRedemption] = useState('immediate');
  const [accountDetails, setAccountDetails] = useState({ bank: '', accountNumber: '', name: '' });
  const [provideLater, setProvideLater] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-4">
      {/* Section 1: Registry Summary */}
      <section className="mb-6 sm:mb-8 bg-white rounded shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Registry Summary</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center"><div className="text-xl sm:text-2xl font-bold">{summary.totalItems}</div><div className="text-gray-600 text-xs sm:text-sm">Total Items</div></div>
          <div className="text-center"><div className="text-xl sm:text-2xl font-bold">{summary.fullyContributed}</div><div className="text-gray-600 text-xs sm:text-sm">Fully Contributed</div></div>
          <div className="text-center"><div className="text-xl sm:text-2xl font-bold">{summary.partiallyContributed}</div><div className="text-gray-600 text-xs sm:text-sm">Partially Contributed</div></div>
          <div className="text-center"><div className="text-xl sm:text-2xl font-bold">{summary.delivered}</div><div className="text-gray-600 text-xs sm:text-sm">Delivered</div></div>
          <div className="text-center"><div className="text-xl sm:text-2xl font-bold">₦{summary.totalContributed.toLocaleString()}</div><div className="text-gray-600 text-xs sm:text-sm">Total Contributed</div></div>
        </div>
      </section>

      {/* Section 2: Quick Links */}
      <section className="bg-white rounded shadow p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 items-center justify-between mb-6 sm:mb-8">
        <Link to="/registry/1" className="w-full text-center px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">View Registry</Link>
        <Link to="/catalog" className="w-full text-center px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">Browse Products</Link>
        <Link to="/profile" className="w-full text-center px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">My Profile</Link>
      </section>

      {/* Section 3: Registry Details */}
      <section className="mb-6 sm:mb-8 bg-white rounded shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Registry Details</h2>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <div className="font-semibold">Couple Names:</div>
            <div>{details.couple_names}</div>
          </div>
          <button className="text-[#B8860B] underline">Edit</button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <div className="font-semibold">Wedding Photos:</div>
            <div className="flex gap-2 mt-1 flex-wrap">{details.photos.length === 0 ? <span className="text-gray-400">No photos</span> : details.photos.map((url, i) => <img key={i} src={url} alt="Wedding" className="w-16 h-16 object-cover rounded" />)}</div>
          </div>
          <button className="text-[#B8860B] underline">Edit</button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <div className="font-semibold">Love Story:</div>
            <div>{details.story}</div>
          </div>
          <button className="text-[#B8860B] underline">Edit</button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <div className="font-semibold">Message to Gifters:</div>
            <div>{details.messageToGifters}</div>
          </div>
          <button className="text-[#B8860B] underline">Edit</button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <div className="font-semibold">Wedding Date:</div>
            <div>{details.wedding_date}</div>
          </div>
          <button className="text-[#B8860B] underline">Edit</button>
        </div>
      </section>

      {/* Section 4: Gift Redemption Options */}
      <section className="mb-8 bg-white rounded shadow p-4 sm:p-6">
        <div className="font-bold mb-2 text-sm sm:text-base">
          To understand the meaning of these options go to the{' '}
          <Link to="/how-it-works" className="underline text-[#B8860B]">How it works</Link> page.
        </div>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Gift Redemption Options</h2>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={redemption}
          onChange={e => setRedemption(e.target.value)}
        >
          <option value="immediate">Get every donation into your account</option>
          <option value="after-wedding">Get all donations after wedding on a set date</option>
          <option value="physical">Get physical items delivered</option>
        </select>
        {(redemption === 'immediate' || redemption === 'after-wedding') && (
          <div className="mb-4">
            <div className="font-semibold mb-2">Account Details</div>
            {!(redemption === 'after-wedding' && provideLater) && (
              <>
                <input type="text" className="w-full border rounded px-3 py-2 mb-2" placeholder="Bank Name" value={accountDetails.bank} onChange={e => setAccountDetails(a => ({ ...a, bank: e.target.value }))} />
                <input type="text" className="w-full border rounded px-3 py-2 mb-2" placeholder="Account Number" value={accountDetails.accountNumber} onChange={e => setAccountDetails(a => ({ ...a, accountNumber: e.target.value }))} />
                <input type="text" className="w-full border rounded px-3 py-2 mb-2" placeholder="Account Name" value={accountDetails.name} onChange={e => setAccountDetails(a => ({ ...a, name: e.target.value }))} />
              </>
            )}
            {redemption === 'after-wedding' && (
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" checked={provideLater} onChange={e => setProvideLater(e.target.checked)} />
                  <span className="ml-2">I want to provide account information at a later time</span>
                </label>
              </div>
            )}
            {redemption === 'after-wedding' && provideLater && (
              <div className="mt-2 text-green-700 font-semibold text-sm">We will reach out to you 2 weeks before your wedding date to collect your account information.</div>
            )}
          </div>
        )}
        {redemption === 'physical' && (
          <div className="mb-4 text-green-700 font-semibold text-sm">We will reach out to you to arrange delivery of your gifts.</div>
        )}
        <div className="mt-2 text-gray-700 text-xs sm:text-sm">You can update this setting anytime. If you need additional support, please <a href="/contact" className="underline text-[#B8860B]">contact us</a>.</div>
        <button className="w-full sm:w-auto mt-4 px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">Save Redemption Option</button>
      </section>
    </div>
  );
};

export default Dashboard;