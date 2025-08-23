'use client'

import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-300 text-gray-600 text-center text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} SSI Studios. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-900 transition-colors duration-200" aria-label="Privacy Policy">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors duration-200" aria-label="Terms of Service">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors duration-200" aria-label="Contact Us">Contact Us</a>
          </div>
          <div className="flex space-x-3">
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-200" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-200" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-200" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-200" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
