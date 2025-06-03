import React, { useState } from 'react';

const WHATSAPP_NUMBER = '2348012345678'; // Replace with your WhatsApp number
const EMAIL_ADDRESS = 'support@blissgift.com'; // Replace with your support email

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
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#2C1810]">Contact Us</h1>
      <div className="bg-white rounded shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">1. Fill the form</h2>
        {submitted ? (
          <div className="text-green-700 font-semibold">Thank you for reaching out! We will get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm sm:text-base" required />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Phone Number or Email</label>
              <input type="text" name="contact" value={form.contact} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm sm:text-base" required />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm sm:text-base" rows={4} required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508]">Send Message</button>
          </form>
        )}
      </div>
      <div className="bg-white rounded shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">2. Send us a message via WhatsApp</h2>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-center"
        >
          Message us on WhatsApp
        </a>
      </div>
      <div className="bg-white rounded shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">3. Send us an email</h2>
        <a
          href={`mailto:${EMAIL_ADDRESS}`}
          className="inline-block w-full sm:w-auto px-4 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508] font-semibold text-center"
        >
          Email us at {EMAIL_ADDRESS}
        </a>
      </div>
    </div>
  );
};

export default ContactUs; 