import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        {/* Logo/Brand Name */}
        <div className="text-white text-xl font-semibold">Welcome</div>

        {/* Centered Home Link */}
        <div className="flex justify-center w-full">
          <Link to="/" className="text-white">
            Home
          </Link>
        </div>

        {/* Right Side: Toggle for mobile and Logout */}
        <div className="flex items-center space-x-4">
          {/* Toggle Button (for small screens) */}
          <button
            onClick={toggleMenu}
            className="text-white md:hidden"
            aria-label="Toggle Menu"
          >
            <FiMenu size={24} />
          </button>

          {/* Logout Button */}
          <Link to="/login" className="text-white flex items-center">
            <FiLogOut size={20} className="mr-2" />
            Logout
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Hidden on large screens) */}
      {isOpen && (
        <div className="md:hidden bg-gray-700 p-2 mt-2">
          <Link to="/" className="block text-white py-2">
            Home
          </Link>
          <Link to="/login" className="block text-white py-2">
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
