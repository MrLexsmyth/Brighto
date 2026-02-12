import React from 'react';

const ScrollIndicator = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-7 h-12 border-2 border-gray-400 rounded-full flex justify-center relative">
         <div className="w-1.5 h-1.5 bg-red rounded-full absolute left-1/2 top-7 transform -translate-x-1/2 " />
      </div>
      <p className="text-sm text-white mt-1">Scroll Down</p>
    </div>
  );
};

export default ScrollIndicator;


