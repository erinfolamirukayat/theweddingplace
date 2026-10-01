import React, { useState } from 'react';
import { MailIcon, MessageSquareIcon, SendIcon, CheckCircle2Icon } from 'lucide-react';

const EMAIL_ADDRESS = 'info@celebrive.com';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-[#ECDFD7] border border-[#E8DCC4] text-[#B8860B] text-sm font-bold uppercase tracking-widest shadow-sm">
            <MessageSquareIcon className="w-4 h-4 mr-2" />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C1810] tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question about setting up your registry or need help with a gift? We're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Form Section */}
          <div className="md:col-span-3 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Send us a message</h2>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 bg-[#FDFBF7] rounded-2xl border border-[#E8DCC4]">
                <CheckCircle2Icon className="w-16 h-16 text-[#B8860B] mb-4" />
                <h3 className="text-2xl font-bold text-[#2C1810] mb-2">Message Sent!</h3>
                <p className="text-gray-600 max-w-xs">
                  Thank you for reaching out. A member of our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 focus:border-[#B8860B] transition-colors" 
                    placeholder="John Doe"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email or Phone Number</label>
                  <input 
                    type="text" 
                    name="contact" 
                    value={form.contact} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 focus:border-[#B8860B] transition-colors" 
                    placeholder="john@example.com"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">How can we help?</label>
                  <textarea 
                    name="message" 
                    value={form.message} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 focus:border-[#B8860B] transition-colors resize-none" 
                    rows={5} 
                    placeholder="Tell us what you need assistance with..."
                    required 
                  />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}
                <button 
                  type="submit" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#B8860B] text-white font-bold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors focus:ring-4 focus:ring-[#B8860B]/20"
                >
                  <SendIcon className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Direct Contact Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#ECDFD7] text-[#B8860B] rounded-xl flex items-center justify-center mb-6">
                <MailIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#2C1810] mb-2">Email Us</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Prefer to send an email directly? We typically respond within 24 hours.
              </p>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="inline-flex w-full items-center justify-center px-6 py-3 bg-[#FDFBF7] border-2 border-[#E8DCC4] text-[#8B6508] font-bold rounded-xl hover:bg-[#ECDFD7] transition-colors"
              >
                {EMAIL_ADDRESS}
              </a>
            </div>

            <div className="bg-[#B8860B] p-8 rounded-3xl shadow-sm text-white relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 opacity-10">
                <MessageSquareIcon className="w-48 h-48" />
              </div>
              <h2 className="text-xl font-bold mb-2 relative z-10">Working Hours</h2>
              <p className="text-[#ECDFD7] relative z-10 leading-relaxed">
                Our support team is available Monday through Friday, from 9:00 AM to 6:00 PM (EST).
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
