import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, ShareIcon } from 'lucide-react';

const BANNER_IMAGE =
  'https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-misc-images//new-weds5.png'; // Couple image from Unsplash
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

  // Testimonial carousel data
  const testimonials = [
    {
      quote: "I didn't even know wedding gift registries were a thing in Nigeria. Using Bliss and Gifts saved us from getting 4 kettles and 2 toasters. Every gift we received helped us build our first home together.",
      author: 'Kemi & Dayo, Lagos',
    },
    {
      quote: "Our guests actually thanked us for using Bliss and Gifts. They said it made buying gifts stress-free — no last-minute shopping or wrapping. Everyone was happy!",
      author: 'Uche & Chiamaka, Owerri',
    },
    {
      quote: "We received exactly what we needed — a fridge, dining table, and even part of our rent. No double gifts. No heavy lifting from the venue. Just peace of mind.",
      author: 'Amina & Bashir, Abuja',
    },
    {
      quote: "Traditionally, our parents expected wrapped gifts. But when they saw how convenient the registry was, they were impressed. We got cash gifts too, and that really helped.",
      author: 'Folu & Tosin, Ibadan',
    },
    {
      quote: "After carrying 3 cartons of plates home from my sister's wedding last year, I knew I wanted a different experience. Bliss and Gifts made sure we only got what we asked for.",
      author: 'Tola, Bride-to-be',
    },
    {
      quote: "We used Bliss and Gifts for our small wedding and shared the registry link on WhatsApp. Our friends contributed to our honeymoon fund — best decision ever.",
      author: 'Timi & Nneka, Port Harcourt',
    },
    {
      quote: "The stress of transporting bulky gifts from the venue is too much. I love that with this registry, everything was delivered directly to us. No stories, no stress.",
      author: 'Amarachi & Ebuka, Enugu',
    },
  ];
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialsPerView = 1; // default for mobile
  const [perView, setPerView] = useState(testimonialsPerView);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive testimonials per view
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1280) setPerView(4);
      else if (window.innerWidth >= 1024) setPerView(3);
      else if (window.innerWidth >= 640) setPerView(2);
      else setPerView(1);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    autoAdvanceRef.current = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 10000);
    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, [perView, testimonials.length]);

  // Calculate visible testimonials
  const getVisibleTestimonials = () => {
    let start = testimonialIdx;
    let end = start + perView;
    if (end <= testimonials.length) {
      return testimonials.slice(start, end);
    } else {
      // Wrap around
      return [
        ...testimonials.slice(start, testimonials.length),
        ...testimonials.slice(0, end - testimonials.length),
      ];
    }
  };
  const visibleTestimonials = getVisibleTestimonials();

  const prevTestimonial = () => {
    setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  };
  const nextTestimonial = () => {
    setTestimonialIdx((i) => (i + 1) % testimonials.length);
  };

  // Featured Items Carousel Data
  const featuredProducts = [
    {
      id: 1,
      name: "Better Homes 16-Piece Dinner Set",
      price: "₦40,000",
      image_url: "https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-product-images/Better_Homes_16-Piece_Dinner_Set.jpg?",
    },
    {
      id: 3,
      name: "Solid Stoneware Dinner Plate Set 16pcs",
      price: "₦58,900",
      image_url: "https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-product-images//Solid_Stoneware_Dinner_Plate_Set_16pcs.jpg",
    },
    {
      id: 6,
      name: "SILVER CREST 2L Industrial 8500W Food Crusher Blender With 2 Jar",
      price: "₦27,280",
      image_url: "https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-product-images/SILVER_CREST_2L_Industrial_8500W_Food_Crusher_Blender_With_2_Jar.jpg?",
    },
    {
      id: 7,
      name: "TINMO Airfryer 10L Volume, 8L Storage Capacity",
      price: "₦58,356",
      image_url: "https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-product-images/TINMO_Airfryer_10L_Volume,_8L_Storage_Capacity,_Model_(OLM-KZB006)_1400W+_12_Months_Warranty.jpg?",
    },
    {
      id: 12,
      name: "Black White Center Table-Coffee Table Home Furniture",
      price: "₦42,000",
      image_url: "https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-product-images/Black_White_Center_Table-Coffee_Table_Home_Furniture.jpg?",
    },
    {
      id: 15,
      name: "Nexus 32 Inches FHD TV (H620B(SA) - Black + 2 Years Warranty",
      price: "₦136,000",
      image_url: "https://wmhidpsitmleveitrtju.supabase.co/storage/v1/object/public/wedding-registry-product-images/Nexus_32_Inches_FHD_TV_(H620B(SA)_-_Black_+_2_Years_Warranty.jpg?",
    },
  ];
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const featuredAutoRef = useRef<NodeJS.Timeout | null>(null);

  // Featured carousel auto-advance
  useEffect(() => {
    if (featuredAutoRef.current) clearInterval(featuredAutoRef.current);
    featuredAutoRef.current = setInterval(() => {
      setFeaturedIdx((i) => (i + 1) % featuredProducts.length);
    }, 5000);
    return () => {
      if (featuredAutoRef.current) clearInterval(featuredAutoRef.current);
    };
  }, [featuredProducts.length]);

  // Get 3 featured products in view
  const getVisibleFeatured = () => {
    let start = featuredIdx;
    let end = start + 3;
    if (end <= featuredProducts.length) {
      return featuredProducts.slice(start, end);
    } else {
      return [
        ...featuredProducts.slice(start, featuredProducts.length),
        ...featuredProducts.slice(0, end - featuredProducts.length),
      ];
    }
  };
  const visibleFeatured = getVisibleFeatured();
  const prevFeatured = () => {
    setFeaturedIdx((i) => (i - 1 + featuredProducts.length) % featuredProducts.length);
  };
  const nextFeatured = () => {
    setFeaturedIdx((i) => (i + 1) % featuredProducts.length);
  };

  return <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-4">
      {/* Banner */}
      <div
        className="w-full min-h-56 sm:min-h-80 md:min-h-[28rem] bg-cover bg-center flex items-center justify-center relative rounded-b-lg overflow-hidden mb-8 py-8 sm:py-16"
        style={{ backgroundImage: `url(${BANNER_IMAGE})`, backgroundPosition: 'center 20%' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 text-center px-4 flex flex-col items-center w-full gap-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow">
            The Nigerian Wedding Registry That Makes Gift-Giving Easy
          </h1>
          <p className="text-base sm:text-lg text-white drop-shadow mb-8">
            Not the court wedding oh! This is the gift registry — where you choose the exact items you need for your dream home, and your loved ones buy them for you.
          </p>
          <button
            onClick={handleStartRegistry}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors text-base sm:text-lg"
          >
            <span className="mr-2">🛒</span>
            Create Your Free Wedding Registry
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#2C1810] mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="text-base sm:text-lg font-semibold text-[#B8860B] mb-1 sm:mb-2">Create your wedding gift list</h3>
            <p className="text-gray-600 text-sm sm:text-base">Choose items you need like fridge, sofa, or cash support</p>
          </div>
          {/* Step 2 */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
            <div className="mb-4 text-4xl">📲</div>
            <h3 className="text-base sm:text-lg font-semibold text-[#B8860B] mb-1 sm:mb-2">Share with your guests</h3>
            <p className="text-gray-600 text-sm sm:text-base">Via WhatsApp, Instagram, or your wedding invite</p>
          </div>
          {/* Step 3 */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
            <div className="mb-4 text-4xl">🎁</div>
            <h3 className="text-base sm:text-lg font-semibold text-[#B8860B] mb-1 sm:mb-2">Receive the perfect gifts</h3>
            <p className="text-gray-600 text-sm sm:text-base">No more carrying bulky boxes or getting 3 irons</p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/how-it-works" className="inline-block px-6 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508] font-medium text-base shadow transition-colors">Learn more about how it works</Link>
        </div>
      </section>

      {/* Why Choose an Online Wedding Registry Section */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#2C1810] mb-8">Why Choose an Online Wedding Registry?</h2>
        <ul className="max-w-3xl mx-auto flex flex-col gap-6">
          <li className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <span className="text-2xl sm:text-3xl mt-1">🎯</span>
            <span className="text-gray-700 text-base sm:text-lg">No more unwanted gifts – <span className="font-medium">Get what you actually need</span></span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <span className="text-2xl sm:text-3xl mt-1">💪</span>
            <span className="text-gray-700 text-base sm:text-lg">No stress moving bulky items – <span className="font-medium">No more lifting heavy wrapped items from the wedding venue</span></span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <span className="text-2xl sm:text-3xl mt-1">🛋️</span>
            <span className="text-gray-700 text-base sm:text-lg">Build your dream home – <span className="font-medium">Every gift brings you closer to a cozy, well-furnished space</span></span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <span className="text-2xl sm:text-3xl mt-1">💸</span>
            <span className="text-gray-700 text-base sm:text-lg">Cash and gift options – <span className="font-medium">Guests can send money or shop your list</span></span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <span className="text-2xl sm:text-3xl mt-1">🤝</span>
            <span className="text-gray-700 text-base sm:text-lg">Involve your community – <span className="font-medium">Friends and family contribute meaningfully</span></span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <span className="text-2xl sm:text-3xl mt-1">📦</span>
            <span className="text-gray-700 text-base sm:text-lg">Delivered straight to you – <span className="font-medium">Gifts go to your preferred location, not the reception hall</span></span>
          </li>
        </ul>
      </section>

      {/* Featured Items Carousel Section */}
      <section className="mt-10 sm:mt-16">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C1810] mb-3 sm:mb-4 text-center">
            Featured Items
          </h2>
          <div className="relative">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(0)` }}>
              {visibleFeatured.map((item, idx) => (
                <div key={item.id} className="flex-1 min-w-0 max-w-full px-2">
                  <div className="bg-[#FFF8F3] rounded-lg overflow-hidden h-full flex flex-col">
                    <img src={item.image_url} alt={item.name} className="w-full h-40 sm:h-48 object-cover" />
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                      <h3 className="font-semibold text-[#2C1810] text-base sm:text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={prevFeatured} aria-label="Previous featured" className="px-3 py-1 rounded bg-[#E5E7EB] hover:bg-[#B8860B] hover:text-white text-[#2C1810] font-bold transition-colors">&#8592;</button>
              <button onClick={nextFeatured} aria-label="Next featured" className="px-3 py-1 rounded bg-[#E5E7EB] hover:bg-[#B8860B] hover:text-white text-[#2C1810] font-bold transition-colors">&#8594;</button>
            </div>
            <div className="mt-2 flex justify-center gap-1">
              {featuredProducts.map((_, i) => (
                <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === featuredIdx ? 'bg-[#B8860B]' : 'bg-gray-300'}`}></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel Section */}
      <section className="max-w-6xl mx-auto my-12">
        <div className="bg-[#FFF8F3] rounded-lg shadow-md px-2 sm:px-6 py-10 sm:py-12 relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C1810] mb-8 text-center">What Couples Are Saying</h2>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(0)` }}>
              {visibleTestimonials.map((t, idx) => (
                <div key={idx} className="flex-1 min-w-0 max-w-full px-2">
                  <div className="h-full flex flex-col justify-between bg-white rounded-lg shadow p-6 sm:p-8 mx-auto text-center">
                    <blockquote className="text-lg sm:text-xl italic text-[#2C1810] font-medium mb-4">“{t.quote}”</blockquote>
                    <div className="text-[#B8860B] font-semibold text-base sm:text-lg">— {t.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={prevTestimonial} aria-label="Previous testimonial" className="px-3 py-1 rounded bg-[#E5E7EB] hover:bg-[#B8860B] hover:text-white text-[#2C1810] font-bold transition-colors">&#8592;</button>
            <button onClick={nextTestimonial} aria-label="Next testimonial" className="px-3 py-1 rounded bg-[#E5E7EB] hover:bg-[#B8860B] hover:text-white text-[#2C1810] font-bold transition-colors">&#8594;</button>
          </div>
          <div className="mt-4 flex justify-center gap-1">
            {testimonials.map((_, i) => (
              <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === testimonialIdx ? 'bg-[#B8860B]' : 'bg-gray-300'}`}></span>
            ))}
          </div>
        </div>
      </section>
    </div>;
};
export default Home;