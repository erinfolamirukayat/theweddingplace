import React from "react";
import { Link } from "react-router-dom";

const HowItWorks = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold mb-8 text-[#2C1810]">How It Works</h1>

    <div className="space-y-8 text-lg text-gray-800">
      {/* Step 1 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[#B8860B] text-white rounded-full flex items-center justify-center font-bold">
          1
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#2C1810]">
            Create Your Registry
          </h2>
          <p className="mt-1">
            Start by exploring our catalog and adding the items you'd love to
            receive for your new home.
          </p>
          <div className="mt-3 text-sm text-gray-700 bg-[#FFF8F3] p-4 rounded-md border border-[#E8DCC4]">
            <strong>Good to know:</strong> The prices shown in the catalog are
            estimates to guide your guests. Don't worry if market prices
            fluctuate before your wedding—you are never locked in, and you
            retain ultimate control over how your funds are spent!
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[#B8860B] text-white rounded-full flex items-center justify-center font-bold">
          2
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#2C1810]">
            Share With Loved Ones
          </h2>
          <p className="mt-1">
            Send your unique registry link to friends and family so they can
            easily contribute to your dream home from anywhere in the world.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[#B8860B] text-white rounded-full flex items-center justify-center font-bold">
          3
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#2C1810]">
            Watch Your Funds Grow
          </h2>
          <p className="mt-1">
            As your loved ones contribute, all money is safely pooled into your
            overall registry balance.
          </p>
          <p className="mt-2 text-base text-gray-600">
            It is completely okay if some items are only partially funded. Think
            of your registry as a flexible savings fund. You will never lose
            partial contributions.
          </p>
        </div>
      </div>

      {/* Step 4 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[#B8860B] text-white rounded-full flex items-center justify-center font-bold">
          4
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#2C1810]">
            Redeem Your Way
          </h2>
          <p className="mt-1 mb-4">
            When you are ready, you have complete flexibility in how you use
            your pooled funds. You can mix and match any of these three options:
          </p>

          <ul className="space-y-4">
            <li className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <span className="font-semibold text-[#8B6508] block mb-2">
                🎁 Physical Gifts Delivered (Recommended)
              </span>
              <p className="text-base text-gray-700">
                Choose the items you want most, and we will deliver them on your
                selected date. You can easily combine partial contributions from
                different items to fully fund a specific gift, or swap out items
                entirely. A dedicated person from Celebron will work with you to
                discuss and finalize this list. This maximizes the power of a
                registry, ensuring you set up your home exactly as you
                envisioned.
              </p>
            </li>

            <li className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <span className="font-semibold text-[#8B6508] block mb-2">
                💰 Lump Sum Cash After Your Wedding
              </span>
              <p className="text-base text-gray-700">
                Set a date and provide your account information to withdraw your
                entire balance as a single cash payout.
              </p>
              <p className="text-sm text-gray-500 mt-2 italic">
                Note: While this gives you ultimate freedom, you may end up
                spending the cash on everyday expenses rather than the beautiful
                home setup you originally planned.
              </p>
            </li>

            <li className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <span className="font-semibold text-[#8B6508] block mb-2">
                ⚡ Instant Cash Transfers
              </span>
              <p className="text-base text-gray-700">
                Have individual contributions sent directly to your bank account
                as soon as they are made by your guests.
              </p>
              <p className="text-sm text-gray-500 mt-2 italic">
                Note: While this is highly convenient, it can be difficult to
                account for all the individual deposits, making it harder to
                stay focused on your original goal of setting up your dream
                home.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="mt-12 text-center">
      <Link
        to="/create-registry"
        className="inline-block px-8 py-4 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6508] font-semibold text-lg transition-colors shadow-sm"
      >
        Start Your Registry
      </Link>
    </div>
  </div>
);

export default HowItWorks;
