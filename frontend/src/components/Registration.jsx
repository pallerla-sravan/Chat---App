import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here, e.g., send data to the server
    console.log('Username:', username);
    console.log('Description:', description);
    navigate('/chat');
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
