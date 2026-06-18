import React from 'react';

const Loader = ({ message = "Loading..." }) => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
    <span className="text-gray-500 font-medium">{message}</span>
  </div>
);

export default Loader;
