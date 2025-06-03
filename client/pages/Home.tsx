import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, ShareIcon } from 'lucide-react';

const BANNER_IMAGE =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80'; // Couple image from Unsplash

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
  return <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {/* Banner */}
      <div
        className="w-full h-40 sm:h-64 md:h-80 bg-cover bg-center flex items-center justify-center relative rounded-b-lg overflow-hidden mb-8"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center px-4 flex flex-col items-center w-full">
          <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow mb-2">
            Celebrate Your Love Story
          </h1>
          <p className="text-base sm:text-lg text-white drop-shadow mb-4">
            Create your perfect wedding registry and share your joy with friends and family
          </p>
          <button
            onClick={handleStartRegistry}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors text-base sm:text-lg"
          >
            <HeartIcon className="h-5 w-5 mr-2" />
            Start Your Registry
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFF8F3] rounded-full mb-4">
            <div className="h-6 w-6 text-[#B8860B]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#2C1810] mb-1 sm:mb-2">
            Curated Selection
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose from our carefully selected collection of traditional and
            modern items
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFF8F3] rounded-full mb-4">
            <ShareIcon className="h-6 w-6 text-[#B8860B]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#2C1810] mb-1 sm:mb-2">
            Easy Sharing
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Share your registry with family and friends with a simple link
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFF8F3] rounded-full mb-4">
            <HeartIcon className="h-6 w-6 text-[#B8860B]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#2C1810] mb-1 sm:mb-2">
            Group Gifting
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Allow loved ones to contribute any amount towards your desired gifts
          </p>
        </div>
      </div>
      <div className="mt-10 sm:mt-16 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C1810] mb-3 sm:mb-4 text-center">
            Featured Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Sample featured items */}
            <div className="bg-[#FFF8F3] rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1604771240470-124b6144b410?auto=format&fit=crop&q=80" alt="Traditional Cookware" className="w-full h-40 sm:h-48 object-cover" />
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-[#2C1810] text-base sm:text-lg">
                  Traditional Clay Cooking Set
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  Starting from ₦50,000
                </p>
              </div>
            </div>
            <div className="bg-[#FFF8F3] rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1629624927838-3b39b7fdd00c?auto=format&fit=crop&q=80" alt="Ankara Bedding" className="w-full h-40 sm:h-48 object-cover" />
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-[#2C1810] text-base sm:text-lg">
                  Ankara Print Bedding Set
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  Starting from ₦75,000
                </p>
              </div>
            </div>
            <div className="bg-[#FFF8F3] rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80" alt="Dining Set" className="w-full h-40 sm:h-48 object-cover" />
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-[#2C1810] text-base sm:text-lg">
                  Modern African Dining Set
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
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