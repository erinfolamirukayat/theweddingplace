import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Layout';
import { getConfig } from '../config';

const Profile = () => {
  const { user, token } = useAuth();
  const { setMessage } = useNotification();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    how_heard: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      fetch(`${getConfig().apiUrl}/auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setForm({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            how_heard: data.how_heard || '',
          });
        });
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getConfig().apiUrl}/auth/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          how_heard: form.how_heard,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Update failed');
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