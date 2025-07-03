// ✅ LoginModal.jsx (only handles login now)
import React, { useState } from 'react';
import { loginUser } from '../services/auth';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSite, setSelectedSite] = useState('https://api-amdital.dev.diginnovators.site/wp');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginUser(email, password, selectedSite);
    setIsLoading(false);

    if (result.success) {
      onClose(true, result.user); // tell App to move to next page
    } else {
      setError(result.message || 'Login failed');
      console.log(res);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#090223] bg-opacity-90 flex justify-center items-center z-50 font-sans">
      <div className="bg-white w-[400px] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-[#290974] mb-1">
          Am<span className="font-bold">Dital</span>
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your credentials to access your account.
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter the email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ring-purple-400"
          />
          <input
            type="password"
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ring-purple-400"
          />
          {/* <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="https://api-amdital.dev.diginnovators.site/wp">Dev Site</option>
            <option value="https://demo.diginnovators.site/wp">Demo Site</option>
          </select> */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          © AmDital • Privacy & Terms
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
