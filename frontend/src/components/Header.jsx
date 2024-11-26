import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
              Home
            </Link>
            <Link to="/about" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
              About
            </Link>
            <Link to="/projects" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
              Projects
            </Link>
            <Link to="/contact" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
              Contact
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try GPT Interface
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;