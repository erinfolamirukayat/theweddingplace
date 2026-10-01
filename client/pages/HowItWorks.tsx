import React from "react";
import { Link } from "react-router-dom";
import { GiftIcon, ShareIcon, TrendingUpIcon, CheckCircle2Icon, TruckIcon, BanknoteIcon, CreditCardIcon } from "lucide-react";

const HowItWorks = () => (
  <div className="min-h-screen bg-[#FDFBF7] py-12 sm:py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-[#ECDFD7] border border-[#E8DCC4] text-[#B8860B] text-sm font-bold uppercase tracking-widest shadow-sm">
          <GiftIcon className="w-4 h-4 mr-2" />
          The Process
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C1810] tracking-tight mb-4">
          How It Works
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your dream home is just four simple steps away. We make it incredibly easy for you and your guests.
        </p>
      </div>

      <div className="space-y-12">
        {/* Step 1 */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-8 items-start hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-16 h-16 bg-[#ECDFD7] text-[#B8860B] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">
            1
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-3">
              Create Your Registry
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Sign up for an account if you don't already have one, then start by exploring our catalog and adding the items you'd love to receive for your new home.
            </p>
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#E8DCC4] flex items-start gap-4">
              <CheckCircle2Icon className="w-6 h-6 text-[#B8860B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-[#2C1810]">Good to know:</strong> The prices shown in the catalog are estimates to guide your guests. Don't worry if market prices fluctuate before your wedding—you are never locked in, and you retain ultimate control over how your funds are spent!
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-8 items-start hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-16 h-16 bg-[#ECDFD7] text-[#B8860B] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">
            2
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-3 flex items-center gap-3">
              Share With Loved Ones
              <ShareIcon className="w-6 h-6 text-[#B8860B] opacity-50" />
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Send your unique, beautifully designed registry link to friends and family so they can easily contribute to your dream home from anywhere in the world.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-8 items-start hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-16 h-16 bg-[#ECDFD7] text-[#B8860B] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">
            3
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-3 flex items-center gap-3">
              Watch Your Funds Grow
              <TrendingUpIcon className="w-6 h-6 text-[#B8860B] opacity-50" />
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              As your loved ones contribute, all money is safely pooled into your overall registry balance.
            </p>
            <p className="text-base text-gray-500 italic">
              It is completely okay if some items are only partially funded. Think of your registry as a flexible savings fund. You will never lose partial contributions.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-8 items-start hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-16 h-16 bg-[#ECDFD7] text-[#B8860B] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">
            4
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-3">
              Redeem Your Way
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              When you are ready, you have complete flexibility in how you use your pooled funds. You can mix and match any of these three options:
            </p>

            <div className="space-y-6">
              <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8DCC4] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TruckIcon className="w-24 h-24 text-[#B8860B]" />
                </div>
                <h3 className="font-bold text-[#8B6508] text-lg flex items-center gap-2 mb-3">
                  <TruckIcon className="w-5 h-5" />
                  Physical Gifts Delivered (Recommended)
                </h3>
                <p className="text-gray-700 leading-relaxed relative z-10">
                  Choose the items you want most, and we will deliver them on your selected date. You can easily combine partial contributions from different items to fully fund a specific gift, or swap out items entirely. A dedicated person from Celebrive will work with you to discuss and finalize this list. This maximizes the power of a registry, ensuring you set up your home exactly as you envisioned.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BanknoteIcon className="w-24 h-24 text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-3">
                  <BanknoteIcon className="w-5 h-5 text-gray-500" />
                  Lump Sum Cash After Your Wedding
                </h3>
                <p className="text-gray-700 leading-relaxed relative z-10">
                  Set a date and provide your account information to withdraw your entire balance as a single cash payout.
                </p>
                <p className="text-sm text-gray-500 mt-3 italic relative z-10 border-l-2 border-gray-300 pl-3">
                  Note: While this gives you ultimate freedom, you may end up spending the cash on everyday expenses rather than the beautiful home setup you originally planned.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CreditCardIcon className="w-24 h-24 text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-3">
                  <CreditCardIcon className="w-5 h-5 text-gray-500" />
                  Instant Cash Transfers
                </h3>
                <p className="text-gray-700 leading-relaxed relative z-10">
                  Have individual contributions sent directly to your bank account as soon as they are made by your guests.
                </p>
                <p className="text-sm text-gray-500 mt-3 italic relative z-10 border-l-2 border-gray-300 pl-3">
                  Note: While this is highly convenient, it can be difficult to account for all the individual deposits, making it harder to stay focused on your original goal of setting up your dream home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/create-registry"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#B8860B] text-white rounded-xl hover:bg-[#8B6508] font-bold text-lg transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
        >
          <GiftIcon className="w-5 h-5 mr-2" />
          Start Your Registry Today
        </Link>
      </div>
    </div>
  </div>
);

export default HowItWorks;
