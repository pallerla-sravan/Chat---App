import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';


const Login = () => {
    const [currentView, setCurrentView] = useState('signup');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);  
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                {successMessage && (
                    <div className="p-4 bg-green-200 text-green-700 text-center rounded-lg">
                        {successMessage}
                    </div>
                )}

                {currentView === 'signup' && !successMessage && (
                    <div>
                        <SignUp onSuccess={() => handleSuccess('Sign up successful!')} />
                        <p className="mt-4 text-center">
                            Already have an account?{' '}
                            <button
                                className="text-blue-500"
                                onClick={() => setCurrentView('signin')}
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                )}

                {currentView === 'signin' && !successMessage && (
                    <div>
                        <SignIn onSuccess={() => handleSuccess('Sign in successful!')} />
                        <p className="mt-4 text-center">
                            Don't have an account?{' '}
                            <button
                                className="text-blue-500"
                                onClick={() => setCurrentView('signup')}
                            >
                                Sign Up
                            </button>
                        </p> 
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
