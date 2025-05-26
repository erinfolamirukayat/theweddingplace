import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, ShareIcon } from 'lucide-react';
const Home = () => {
  const navigate = useNavigate();
  const handleStartRegistry = () => {
    const registryId = localStorage.getItem('afriwed_registry_id');
    if (registryId) {
      navigate(`/registry/${registryId}`);
    } else {
      navigate('/create-registry');
    }
  };
  return <div className="max-w-6xl mx-auto">
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2C1810] mb-6">
          Create Your Perfect Wedding Registry
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Celebrate your union with meaningful gifts that honor African
          traditions and modern living
        </p>
        <button
          onClick={handleStartRegistry}
          className="inline-flex items-center px-6 py-3 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
        >
          <HeartIcon className="h-5 w-5 mr-2" />
          Start Your Registry
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFF8F3] rounded-full mb-4">
            <div className="h-6 w-6 text-[#B8860B]" />
          </div>
          <h3 className="text-lg font-semibold text-[#2C1810] mb-2">
            Curated Selection
          </h3>
          <p className="text-gray-600">
            Choose from our carefully selected collection of traditional and
            modern items
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFF8F3] rounded-full mb-4">
            <ShareIcon className="h-6 w-6 text-[#B8860B]" />
          </div>
          <h3 className="text-lg font-semibold text-[#2C1810] mb-2">
            Easy Sharing
          </h3>
          <p className="text-gray-600">
            Share your registry with family and friends with a simple link
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFF8F3] rounded-full mb-4">
            <HeartIcon className="h-6 w-6 text-[#B8860B]" />
          </div>
          <h3 className="text-lg font-semibold text-[#2C1810] mb-2">
            Group Gifting
          </h3>
          <p className="text-gray-600">
            Allow loved ones to contribute any amount towards your desired gifts
          </p>
        </div>
      </div>
      <div className="mt-16 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#2C1810] mb-4 text-center">
            Featured Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Sample featured items */}
            <div className="bg-[#FFF8F3] rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1604771240470-124b6144b410?auto=format&fit=crop&q=80" alt="Traditional Cookware" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-[#2C1810]">
                  Traditional Clay Cooking Set
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Starting from ₦50,000
                </p>
              </div>
            </div>
            <div className="bg-[#FFF8F3] rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1629624927838-3b39b7fdd00c?auto=format&fit=crop&q=80" alt="Ankara Bedding" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-[#2C1810]">
                  Ankara Print Bedding Set
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Starting from ₦75,000
                </p>
              </div>
            </div>
            <div className="bg-[#FFF8F3] rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80" alt="Dining Set" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-[#2C1810]">
                  Modern African Dining Set
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Starting from ₦100,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Home;