import React from 'react';

// import './navbar.css'

export default function Navbar() {
  return (
    <div className='absolute w-full border-t-4 border-primary bg-white '>
      <div className='border-b border-gray-300'>
        <div className='flex max-w-6xl mx-auto'>
          <span className='py-3 px-3 text-2xl font-semibold text-primary'>
            Test your catalogue
          </span>
        </div>
      </div>
    </div>
  );
}
