const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/pages/RegistryView.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('from "lucide-react"') && !content.includes("from 'lucide-react'")) {
    content = content.replace('import { Dialog } from "@headlessui/react";', 'import { Dialog } from "@headlessui/react";\nimport { HeartIcon, ShareIcon, CalendarIcon, PlusIcon, ExternalLinkIcon, SettingsIcon, GiftIcon, TrashIcon } from "lucide-react";');
} else {
    content = content.replace(/import \{[^}]*\}\s+from\s+["']lucide-react["'];/, 'import { HeartIcon, ShareIcon, CalendarIcon, PlusIcon, ExternalLinkIcon, SettingsIcon, GiftIcon, TrashIcon, ArrowLeftIcon } from "lucide-react";');
}

const renderItemIndex = content.indexOf('  const renderItem = (item: RegistryItem, isFullyFunded: boolean) => {');
if (renderItemIndex === -1) {
    console.error('Could not find renderItem');
    process.exit(1);
}

const prefix = content.substring(0, renderItemIndex);

const newRender = `  const renderItem = (item: any, isFullyFunded: boolean) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) return null;
    const total = product.price * item.quantity;
    const remaining = Math.max(total - item.contributions_received, 0);
    const progress = (item.contributions_received / total) * 100;

    return (
      <div
        key={item.id}
        className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all hover:border-[#E8DCC4] relative overflow-hidden"
      >
        <div className="w-full sm:w-28 h-40 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFullyFunded && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
              <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Funded
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-grow w-full">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
            <button
              onClick={() => confirmDelete(item.id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
              title="Remove from registry"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.description}</p>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              <span>Qty: {item.quantity}</span>
              <span className={isFullyFunded ? "text-green-600" : "text-[#B8860B]"}>
                ₦{Number(item.contributions_received).toLocaleString()} / ₦{total.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={\`h-full transition-all duration-1000 ease-out \${
                  isFullyFunded ? "bg-green-500" : "bg-[#B8860B]"
                }\`}
                style={{ width: \`\${Math.min(progress, 100)}%\` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B]"></div>
      </div>
    );
  }

  if (error || !registry) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <HeartIcon className="w-16 h-16 text-gray-300 mb-4" />
        <div className="text-xl font-bold text-gray-900 mb-2">Error</div>
        <div className="text-gray-500">{error || "Registry not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-16">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Registry Management Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#FFF8F3] px-6 py-10 sm:p-12 text-center border-b border-[#E8DCC4]/50 relative">
            <HeartIcon className="h-10 w-10 text-[#B8860B] mx-auto mb-4 opacity-50" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] mb-3">
              {registry.couple_names}
            </h1>
            <div className="flex items-center justify-center text-[#B8860B] font-medium mb-8">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {registry.wedding_date ? (
                <span>{new Date(registry.wedding_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              ) : (
                <span className="italic opacity-70">Date not set</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white border-2 border-[#E8DCC4] text-[#B8860B] font-semibold rounded-xl hover:bg-[#FDFBF7] transition-colors shadow-sm"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy Public Link"}
              </button>
              
              <Link
                to={\`/\${registry.share_url}\`}
                target="_blank"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl hover:bg-[#8B6508] transition-colors shadow-sm"
              >
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                View Public Registry
              </Link>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Build Your Wishlist</h2>
              <p className="text-sm text-gray-500">Browse our catalog and add gifts you'd love to receive.</p>
            </div>
            <Link
              to="/catalog"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-[#2C1810] text-white font-semibold rounded-xl hover:bg-black transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Items
            </Link>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="space-y-12">
          {/* Open Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Active Items
              <span className="ml-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {openItems.length}
              </span>
            </h2>
            
            {openItems.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <GiftIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your registry is empty</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">Start building your dream home by adding gifts to your registry.</p>
                <Link
                  to="/catalog"
                  className="inline-flex items-center px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openItems.map((item) => renderItem(item, false))}
              </div>
            )}
          </div>

          {/* Fully Funded Items Section */}
          {fullyFundedItems.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                Fully Funded
                <span className="ml-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                  {fullyFundedItems.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80 grayscale-[0.3]">
                {fullyFundedItems.map((item) => renderItem(item, true))}
              </div>
            </div>
          )}
        </div>

        {/* Note about how it works */}
        <div className="bg-[#FFF8F3] border border-[#E8DCC4] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#B8860B] mr-4">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#2C1810]">
              How Your Registry Works
            </h3>
          </div>
          <ul className="text-sm text-gray-700 space-y-3 list-disc pl-14">
            <li>
              <strong>Flexible Contributions:</strong> Guests can fully fund or
              partially contribute to any item. Prices shown are estimates.
            </li>
            <li>
              <strong>Physical Delivery:</strong> You can choose to have fully or
              partially funded items delivered to your home on your selected date.
              A Celebron rep will work with you to finalize the list.
            </li>
            <li>
              <strong>Cash Options:</strong> Prefer cash? You can easily withdraw
              from your available registry balance at any time.
            </li>
          </ul>
          <div className="mt-6 pl-14">
            <Link
              to="/how-it-works"
              className="inline-flex items-center text-sm font-bold text-[#B8860B] hover:text-[#8B6508] group"
            >
              Read more about how it works 
              <ArrowLeftIcon className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* Custom Confirmation Modal for Item Deletion */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <Dialog.Panel className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white rounded-3xl shadow-xl max-w-md w-full mx-auto p-6 sm:p-8 z-20 text-left overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
            
            <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-2">
              Remove Item?
            </Dialog.Title>
            <div className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to remove this item from your registry? This action cannot be undone.
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                onClick={handleDeleteConfirm}
              >
                Yes, Remove Item
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default RegistryView;
`;

fs.writeFileSync(filePath, prefix + newRender, 'utf-8');
console.log('RegistryView updated.');

