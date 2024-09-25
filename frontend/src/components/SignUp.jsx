import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const SignUp = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email,username, password }),
            });
            const data = await response.json();
            alert(data.msg);
            if (data.msg === 'User registered successfully') {
                sessionStorage.setItem('username',username)
                onSuccess();
                navigate('/chat', { state: { message: 'Sign up successful!' } });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    <span className="text-gray-700">Email</span>
                    <input
                        type="email"
                        className="form-input mt-1 block w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter Email id'
                        required
                    />
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        className="form-input mt-1 block w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Enter username'
                        required
                    />
                </label>
                <label className="block mb-4 relative">
                    <span className="text-gray-700">Password</span>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input mt-1 block w-full pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter Password'
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 mt-6 text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </label>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
