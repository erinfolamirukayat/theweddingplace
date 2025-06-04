import React, { useState, useEffect, useRef } from 'react';
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

  return <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {/* Banner */}
      <div
        className="w-full h-56 sm:h-80 md:h-[28rem] bg-cover bg-center flex items-center justify-center relative rounded-b-lg overflow-hidden mb-8"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
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

      {/* Featured Items Section */}
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