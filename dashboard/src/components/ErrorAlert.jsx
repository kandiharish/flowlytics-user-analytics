import React from 'react';

const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm mb-6">
    <div className="flex">
      <div className="ml-3">
        <p className="text-sm text-red-700 font-medium">
          {message || "An unexpected error occurred."}
        </p>
      </div>
    </div>
  </div>
);

export default ErrorAlert;
