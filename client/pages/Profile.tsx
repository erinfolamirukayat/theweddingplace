import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Layout';
import { getMe, updateMe } from '../utils/api';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { setMessage } = useNotification();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    how_heard: '',
  });
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch data until authentication is resolved and we have a user.
    if (authLoading || !user) {
      if (!authLoading) setLoading(false); // Stop loading if auth is done but no user
      return;
    }

      setError(null);
      getMe()
        .then((data: any) => {
          setForm({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            how_heard: data.how_heard || '',
          });
        })
        .catch((err) => {
          setError(err.message || 'Failed to load profile data.');
        })
        .finally(() => {
          setLoading(false);
        });
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateMe({
        first_name: form.first_name,
        last_name: form.last_name,
        how_heard: form.how_heard,
      });
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">First Name</label>
        <input
          type="text"
          name="first_name"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Last Name</label>
        <input
          type="text"
          name="last_name"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">How did you hear about us?</label>
        <input
          type="text"
          name="how_heard"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.how_heard}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 mb-4 bg-gray-100 cursor-not-allowed"
          value={form.email}
          readOnly
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#B8860B] text-white py-2 rounded hover:bg-[#8B6508]"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile; 