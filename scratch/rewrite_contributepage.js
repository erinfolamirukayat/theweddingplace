const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/pages/ContributePage.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('from "lucide-react"') && !content.includes("from 'lucide-react'")) {
    content = content.replace('import ContributionForm from "../components/ContributionForm";', 'import ContributionForm from "../components/ContributionForm";\nimport { HeartIcon, ArrowLeftIcon, GiftIcon, CreditCardIcon } from "lucide-react";');
} else {
    content = content.replace(/import \{[^}]*\}\s+from\s+["']lucide-react["'];/, 'import { HeartIcon, ArrowLeftIcon, GiftIcon, CreditCardIcon } from "lucide-react";');
}

const returnIndex = content.lastIndexOf('  return (');
if (returnIndex === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const prefix = content.substring(0, returnIndex);

const newRender = `  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(\`/\${shareUrl}\`)}
          className="mb-8 inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to {registry?.couple_names ? registry.couple_names.split(' & ')[0] + "'s" : "the"} Registry
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm text-[#2C1810] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center">
                    <GiftIcon className="w-3.5 h-3.5 mr-1 text-[#B8860B]" />
                    Gift
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {item.name}
                </h1>
                <p className="text-gray-500 mb-6 leading-relaxed text-sm">
                  {item.description}
                </p>
                
                <div className="bg-[#FFF8F3] rounded-2xl p-5 border border-[#E8DCC4] space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Price (x{item.quantity})</span>
                    <span className="font-semibold text-gray-900">₦{Number(totalCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Funded so far</span>
                    <span className="font-semibold text-gray-900">₦{Number(item.contributions_received).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-[#E8DCC4]/50 flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Remaining</span>
                    <span className="text-lg font-black text-[#B8860B]">₦{Number(remainingAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {registry?.story && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center text-sm font-bold text-[#B8860B] uppercase tracking-widest mb-4">
                  <HeartIcon className="w-4 h-4 mr-2" /> Our Story
                </div>
                <blockquote className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                  "{registry.story}"
                </blockquote>
                <button
                  onClick={() => navigate(\`/\${shareUrl}\`)}
                  className="mt-4 text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors"
                >
                  Read full story &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-10 sticky top-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-[#FFF8F3] rounded-2xl flex items-center justify-center text-[#B8860B] mr-4">
                  <CreditCardIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contribute</h2>
                  <p className="text-sm text-gray-500 font-medium">Securely gift the couple.</p>
                </div>
              </div>
              
              <ContributionForm
                registryItemId={item.id}
                itemName={item.name}
                price={item.price}
                remainingAmount={remainingAmount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;
`;

fs.writeFileSync(filePath, prefix + newRender, 'utf-8');
console.log('ContributePage updated.');
