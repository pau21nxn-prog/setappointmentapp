'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-emerald rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">SetAppointment</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#services"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Services
              </a>
              <a
                href="#portfolio"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Portfolio
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#booking"
                className="px-4 py-2 bg-gradient-emerald text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Book Now
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
