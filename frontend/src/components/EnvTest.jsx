import React from 'react';

const EnvTest = () => {
  const testConnection = () => {
    console.log('🔍 Environment Check:');
    console.log('API URL:', import.meta.env.VITE_API_URL);
    console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL);
    
    // Test backend connection
    if (import.meta.env.VITE_API_URL) {
      fetch(import.meta.env.VITE_API_URL + '/api/health')
        .then(response => {
          console.log('✅ Response status:', response.status);
          return response.json();
        })
        .then(data => console.log('✅ Health check result:', data))
        .catch(error => console.error('❌ Connection error:', error));
    } else {
      console.error('❌ VITE_API_URL is not defined');
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Environment Test</h3>
      <button 
        onClick={testConnection}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Environment Variables & Connection
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Open browser console to see test results
      </p>
    </div>
  );
};

export default EnvTest;
