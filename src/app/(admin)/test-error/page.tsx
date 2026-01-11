"use client";

import { useState } from 'react';

export default function TestErrorPage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  // This will trigger the error boundary
  if (shouldThrow) {
    throw new Error('This is a test error to trigger the error boundary!');
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-green-800 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-10"></div>
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full opacity-5"></div>
          
          <div className="relative z-10 px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Test Error Page</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Error Boundary Test
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Click the button below to trigger an error and test the error boundary.
            </p>
            
            <button
              onClick={() => setShouldThrow(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              🚨 Trigger Error Boundary
            </button>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Click the red button above</li>
                <li>• This will throw an error and trigger the error boundary</li>
                <li>• You should see the error page with &quot;Riprova&quot; and &quot;Torna alla Home&quot; buttons</li>
                <li>• Test both buttons to ensure they work correctly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
