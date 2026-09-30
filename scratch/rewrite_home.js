const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('from "lucide-react"') && !content.includes("from 'lucide-react'")) {
    content = content.replace('import { useAuth } from \'../context/AuthContext\';', 'import { useAuth } from \'../context/AuthContext\';\nimport { HeartIcon, GiftIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";');
} else {
    content = content.replace(/import \{[^}]*\}\s+from\s+["']lucide-react["'];/, 'import { HeartIcon, GiftIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";');
}

const returnIndex = content.lastIndexOf('  return <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-4">');
if (returnIndex === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const prefix = content.substring(0, returnIndex);

const newRender = `  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-36 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FFF8F3] opacity-50 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-[#FDF2E9] opacity-50 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-[#FFF8F3] border border-[#E8DCC4] text-[#B8860B] text-sm font-bold uppercase tracking-widest shadow-sm">
            <HeartIcon className="w-4 h-4 mr-2" />
            The Modern Registry
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#2C1810] tracking-tight mb-8 leading-[1.1] max-w-4xl mx-auto">
            Your Dream Start, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37]">
              Gifted with Love.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create a beautiful wedding registry in minutes. Add gifts, receive cash contributions, and build your perfect home together.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#B8860B] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#B8860B]/20 hover:bg-[#8B6508] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center"
            >
              Start Your Registry
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#2C1810] border-2 border-[#E8DCC4] rounded-xl font-bold text-lg shadow-sm hover:bg-[#FFF8F3] transition-colors"
            >
              See How It Works
            </Link>
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
              <div className="w-16 h-16 bg-[#FFF8F3] rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <GiftIcon className="w-8 h-8 text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Curate Your List</h3>
              <p className="text-gray-500 leading-relaxed">
                Choose the items you truly need for your new home, or set up a cash fund for your honeymoon.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FDFBF7] rounded-3xl p-8 text-center border border-[#E8DCC4]/50 shadow-sm hover:shadow-md transition-shadow relative mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8860B] font-black text-xl shadow-sm border border-[#E8DCC4]">
                2
              </div>
              <div className="w-16 h-16 bg-[#FFF8F3] rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <UsersIcon className="w-8 h-8 text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share with Guests</h3>
              <p className="text-gray-500 leading-relaxed">
                Send your unique registry link via WhatsApp, email, or print it directly on your wedding invitations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FDFBF7] rounded-3xl p-8 text-center border border-[#E8DCC4]/50 shadow-sm hover:shadow-md transition-shadow relative mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8860B] font-black text-xl shadow-sm border border-[#E8DCC4]">
                3
              </div>
              <div className="w-16 h-16 bg-[#FFF8F3] rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <CheckCircleIcon className="w-8 h-8 text-[#B8860B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Receive the Perfect Gifts</h3>
              <p className="text-gray-500 leading-relaxed">
                Guests contribute online. Gifts are delivered to your door, or cash is sent straight to your account.
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
              <p className="mt-2 text-gray-500">Popular items couples are adding right now.</p>
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
              style={{ transform: \`translateX(0)\` }}
            >
              {visibleFeatured.map((item) => (
                <div key={item.id} className="flex-1 min-w-[280px] max-w-[33%] px-3">
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full group hover:shadow-md transition-shadow">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{item.name}</h3>
                      <p className="text-[#B8860B] font-black text-xl">
                        {typeof item.price === 'number' || !isNaN(Number(item.price))
                          ? \`₦\${Number(item.price).toLocaleString()}\`
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
                className={\`w-2 h-2 rounded-full transition-all duration-300 \${i === featuredIdx ? 'bg-[#B8860B] w-6' : 'bg-gray-300'}\`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HeartIcon className="w-12 h-12 text-[#B8860B]/20 mx-auto mb-8" />
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out" 
                style={{ transform: \`translateX(0)\` }}
              >
                {visibleTestimonials.map((t, idx) => (
                  <div key={idx} className="flex-1 min-w-full px-4">
                    <blockquote className="text-2xl sm:text-3xl font-medium text-[#2C1810] leading-tight mb-8">
                      "{t.quote}"
                    </blockquote>
                    <div className="inline-flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#FFF8F3] border border-[#E8DCC4] flex items-center justify-center text-[#B8860B] font-bold text-lg mr-4 shadow-sm">
                        {t.author.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900">{t.author}</div>
                        <div className="text-sm text-gray-500">Happy Couple</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12">
              <button onClick={prevTestimonial} className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#B8860B] hover:shadow-md transition-all">
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12">
              <button onClick={nextTestimonial} className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#B8860B] hover:shadow-md transition-all">
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
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
          <p className="text-xl text-[#FFF8F3] mb-10 max-w-2xl mx-auto">
            Join the modern way of receiving wedding gifts. It's free to create your registry.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-[#B8860B] font-bold rounded-xl text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
          >
            Create My Registry
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
`;

fs.writeFileSync(filePath, prefix + newRender, 'utf-8');
console.log('Home updated.');
