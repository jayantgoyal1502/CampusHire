import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const SessionExpired = () => {
    const navigate = useNavigate();
    const { setSessionExpired } = useSession(); // use context
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/');
        setSessionExpired(false); // Reset the flag
      }, 3000);
  
      return () => clearTimeout(timeout); // cleanup
    }, [navigate, setSessionExpired]);
  
    const handleGoHome = () => {
      localStorage.removeItem('token');
      setSessionExpired(false); // Reset before navigating
      navigate('/');
    };
  
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-red-600">Session Expired</h2>
          <p className="mt-2 text-gray-700">Please login again to continue.</p>
          <button
            onClick={handleGoHome}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  };
  
export default SessionExpired;
