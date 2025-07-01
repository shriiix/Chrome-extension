import React, { useState } from 'react';
import { loginUser } from '../services/auth';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await loginUser(email, password);
      console.log("Login result:", result);

      if (result.success) {
        // Log storage contents after login
        if (typeof chrome !== "undefined" && chrome?.storage?.local) {
          chrome.storage.local.get(null, (all) => {
            console.log("Chrome storage after login:", all);
          });
        } else {
          console.log("LocalStorage after login:", {
            accessToken: localStorage.getItem('accessToken'),
            user: localStorage.getItem('user')
          });
        }
        
        // Signal success - App.jsx will handle retrieving user from storage
        onClose(true);
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md shadow-xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />

        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded mb-2 transition"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <button
          onClick={() => onClose(false)}
          disabled={isLoading}
          className="w-full text-gray-500 hover:underline disabled:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;