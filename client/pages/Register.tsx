import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/Layout';

const Register = () => {
  const { register } = useAuth();
  const { setMessage } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!firstName.trim() || !lastName.trim() || !howHeard.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    try {
      await register(email, password, firstName, lastName, howHeard);
      setMessage('Registration successful!');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">First Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Last Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">How did you hear about us?</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={howHeard}
          onChange={e => setHowHeard(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#B8860B] text-white py-2 rounded hover:bg-[#8B6508]"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Already have an account?</span>
        <a href="/login" className="ml-2 text-[#B8860B] hover:underline">Log in</a>
      </div>
    </div>
  );
};

export default Register; 