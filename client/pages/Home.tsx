import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  GiftIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
} from "lucide-react";
import { getRegistries, getProducts } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "@headlessui/react";

const BANNER_IMAGE = "/new-weds3.jpg";
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleStartRegistry = () => {
    if (!user) {
      navigate("/register");
      return;
    }
    const registryId = localStorage.getItem("afriwed_registry_id");
    if (registryId) {
      navigate(`/registry/${registryId}`);
    } else {
      navigate("/create-registry");
    }
  };

  // Featured Items Carousel Data (Loaded Dynamically)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts()
      .then((prods) => {
        // Pick up to 6 products for featured items
        setFeaturedProducts(prods.slice(0, 6));
      })
      .catch((err) => {
        console.error("Failed to load featured products:", err);
      });
  }, []);

  const [featuredIdx, setFeaturedIdx] = useState(0);
  const featuredAutoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Featured carousel auto-advance
  useEffect(() => {
    if (featuredProducts.length === 0) return;
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
    if (featuredProducts.length === 0) return [];
    let start = featuredIdx;
    let end = start + Math.min(3, featuredProducts.length);
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
    if (featuredProducts.length === 0) return;
    setFeaturedIdx(
      (i) => (i - 1 + featuredProducts.length) % featuredProducts.length,
    );
  };
  const nextFeatured = () => {
    if (featuredProducts.length === 0) return;
    setFeaturedIdx((i) => (i + 1) % featuredProducts.length);
  };

  const [registries, setRegistries] = useState<any[]>([]);

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const data = await getRegistries();
        setRegistries(data);
      } catch (error) {
        console.error("Error fetching registries:", error);
      }
    };

    fetchRegistries();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-36 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#ECDFD7] opacity-50 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-[#FDF2E9] opacity-50 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-[#ECDFD7] border border-[#E8DCC4] text-[#B8860B] text-sm font-bold uppercase tracking-widest shadow-sm">
            <HeartIcon className="w-4 h-4 mr-2" />
            The Ultimate Gift Registry
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#2C1810] tracking-tight mb-8 leading-[1.1] max-w-4xl mx-auto">
            Your Dream Start, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37]">
              Gifted with Love.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create a beautiful wedding registry in minutes. Add gifts, receive
            cash contributions, and build your perfect home together.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={handleStartRegistry}
                className="w-full sm:w-auto px-8 py-4 bg-[#B8860B] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#B8860B]/20 hover:bg-[#8B6508] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center"
              >
              Start Your Registry
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
              <Link
                to="/how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#2C1810] border-2 border-[#E8DCC4] rounded-xl font-bold text-lg shadow-sm hover:bg-[#ECDFD7] transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      
      {/* What is a Wedding Registry */}
      <section className="py-20 bg-[#FDFBF7] border-y border-[#E8DCC4]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <HeartIcon className="w-12 h-12 text-[#B8860B]/20 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] mb-6">
            What is a Wedding Registry?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            A wedding registry is a curated wish list created by engaged couples to gently guide their guests toward gifts they truly need. 
            It takes the guesswork out of gift-giving, ensuring your loved ones can celebrate your big day by contributing to your new life together—whether that means funding your dream honeymoon, or gifting essential household items.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DCC4]/30">
              <div className="w-10 h-10 bg-[#ECDFD7] rounded-full flex items-center justify-center mb-4 text-[#B8860B]">
                <GiftIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">No More Guesswork</h3>
              <p className="text-sm text-gray-500">Guests know exactly what you want, eliminating duplicate or unwanted gifts.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DCC4]/30">
              <div className="w-10 h-10 bg-[#ECDFD7] rounded-full flex items-center justify-center mb-4 text-[#B8860B]">
                <HeartIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Easy for Guests</h3>
              <p className="text-sm text-gray-500">A seamless online experience lets guests contribute from anywhere in the world.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DCC4]/30">
              <div className="w-10 h-10 bg-[#ECDFD7] rounded-full flex items-center justify-center mb-4 text-[#B8860B]">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Total Flexibility</h3>
              <p className="text-sm text-gray-500">Choose between physical gift delivery or having funds sent straight to your bank account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works simple */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810]">
              Simple, Elegant, Stress-Free
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Three steps to the perfect wedding gifts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-[#FDFBF7] rounded-3xl p-8 text-center border border-[#E8DCC4]/50 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8860B] font-black text-xl shadow-sm border border-[#E8DCC4]">
                1
              </div>
              <div className="w-16 h-16 bg-[#ECDFD7] rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <GiftIcon className="w-8 h-8 text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Curate Your List
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Choose the items you truly need for your new home, or set up a
                cash fund for your honeymoon.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FDFBF7] rounded-3xl p-8 text-center border border-[#E8DCC4]/50 shadow-sm hover:shadow-md transition-shadow relative mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8860B] font-black text-xl shadow-sm border border-[#E8DCC4]">
                2
              </div>
              <div className="w-16 h-16 bg-[#ECDFD7] rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <UsersIcon className="w-8 h-8 text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Share with Guests
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Send your unique registry link via WhatsApp, email, or print it
                directly on your wedding invitations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FDFBF7] rounded-3xl p-8 text-center border border-[#E8DCC4]/50 shadow-sm hover:shadow-md transition-shadow relative mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8860B] font-black text-xl shadow-sm border border-[#E8DCC4]">
                3
              </div>
              <div className="w-16 h-16 bg-[#ECDFD7] rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <CheckCircleIcon className="w-8 h-8 text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Receive the Perfect Gifts
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Guests contribute online. Gifts are delivered to your door, or
                cash is sent straight to your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-20 bg-[#FDFBF7] border-y border-[#E8DCC4]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-[#2C1810]">
                Trending Gifts
              </h2>
              <p className="mt-2 text-gray-500">
                Popular items couples are adding right now.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={prevFeatured}
                className="w-10 h-10 rounded-full bg-white border border-[#E8DCC4] flex items-center justify-center text-gray-600 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors shadow-sm"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={nextFeatured}
                className="w-10 h-10 rounded-full bg-white border border-[#E8DCC4] flex items-center justify-center text-gray-600 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors shadow-sm"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(0)` }}
            >
              {visibleFeatured.map((item) => (
                <div
                  key={item.id}
                  className="flex-1 min-w-[280px] max-w-[33%] px-3"
                >
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full group hover:shadow-md transition-shadow">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#B8860B] font-black text-xl">
                        {typeof item.price === "number" ||
                        !isNaN(Number(item.price))
                          ? `₦${Number(item.price).toLocaleString()}`
                          : item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {featuredProducts.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === featuredIdx ? "bg-[#B8860B] w-6" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#B8860B] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-[#ECDFD7] mb-10 max-w-2xl mx-auto">
            Join the modern way of receiving wedding gifts. It's free to create
            your registry.
          </p>
          <Button
            onClick={handleStartRegistry}
            className="inline-flex items-center px-8 py-4 bg-white text-[#B8860B] font-bold rounded-xl text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
          >
            Create Your Registry
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;



