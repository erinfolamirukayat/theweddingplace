const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/pages/ProductCatalog.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('from "lucide-react"') && !content.includes("from 'lucide-react'")) {
    content = content.replace('import { Dialog } from "@headlessui/react";', 'import { Dialog } from "@headlessui/react";\nimport { SearchIcon, ArrowLeftIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";');
} else {
    content = content.replace(/import \{[^}]*\}\s+from\s+["']lucide-react["'];/, 'import { SearchIcon, ArrowLeftIcon as ArrowLeft, PlusIcon, ShoppingBagIcon, SettingsIcon, CheckIcon } from "lucide-react";');
}

const returnIndex = content.lastIndexOf('  return (');
if (returnIndex === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const prefix = content.substring(0, returnIndex);

const newRender = `  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <button
              onClick={() =>
                navigate(
                  effectiveRegistryId
                    ? \`/registry/\${effectiveRegistryId}\`
                    : "/dashboard",
                )
              }
              className="inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
              Back to Registry
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center">
              <ShoppingBagIcon className="w-8 h-8 mr-3 text-[#B8860B]" />
              Gift Catalog
            </h1>
            <p className="mt-2 text-gray-500">Discover and add the perfect gifts to your registry.</p>
          </div>
          
          <div className="w-full md:w-96">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#B8860B] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-12">
            {currentProducts.map((product) => {
              const inRegistry = isProductInRegistry(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {inRegistry && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md">
                        <CheckIcon className="w-3.5 h-3.5 mr-1" /> Added
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xl font-black text-[#2C1810]">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                      <button
                        onClick={() => openQuantityModal(product)}
                        disabled={inRegistry}
                        className={\`w-10 h-10 rounded-full flex items-center justify-center transition-all \${
                          inRegistry
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#FFF8F3] text-[#B8860B] hover:bg-[#B8860B] hover:text-white hover:shadow-md"
                        }\`}
                        title={inRegistry ? "Already in registry" : "Add to registry"}
                      >
                        {inRegistry ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={\`w-10 h-10 rounded-xl font-bold transition-colors \${
                  currentPage === page
                    ? "bg-[#B8860B] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }\`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Note about how it works */}
        <div className="bg-[#FFF8F3] border border-[#E8DCC4] rounded-3xl p-8 sm:p-10 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#B8860B] mr-4">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#2C1810]">
              How Your Registry Works
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 rounded-2xl p-5 border border-[#E8DCC4]/50">
              <h4 className="font-bold text-gray-900 mb-2">Flexible Contributions</h4>
              <p className="text-sm text-gray-600">Guests can fully fund or partially contribute to any item. Prices shown are estimates.</p>
            </div>
            <div className="bg-white/60 rounded-2xl p-5 border border-[#E8DCC4]/50">
              <h4 className="font-bold text-gray-900 mb-2">Physical Delivery</h4>
              <p className="text-sm text-gray-600">Choose to have fully or partially funded items delivered to your home on your selected date.</p>
            </div>
            <div className="bg-white/60 rounded-2xl p-5 border border-[#E8DCC4]/50">
              <h4 className="font-bold text-gray-900 mb-2">Cash Options</h4>
              <p className="text-sm text-gray-600">Prefer cash? You can easily withdraw from your available registry balance at any time.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center px-6 py-3 bg-white text-[#B8860B] font-bold rounded-xl shadow-sm border border-[#E8DCC4] hover:bg-[#B8860B] hover:text-white transition-all group"
            >
              Read more about how it works
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* Quantity Modal */}
      <Dialog
        open={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <Dialog.Panel className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white rounded-3xl shadow-xl max-w-sm w-full mx-auto p-8 z-20 overflow-hidden text-left">
            <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">
              Add to Registry
            </Dialog.Title>
            <p className="text-sm text-gray-500 mb-6">
              How many {selectedProduct?.name} would you like to add?
            </p>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => setShowQuantityModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors"
                onClick={handleAddToRegistry}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductCatalog;
`;

fs.writeFileSync(filePath, prefix + newRender, 'utf-8');
console.log('ProductCatalog updated.');
