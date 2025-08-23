'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Linkedin, Globe } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { label: 'Instagram', icon: Instagram, href: '#' },
    { label: 'Facebook', icon: Facebook, href: '#' },
    { label: 'Twitter', icon: Twitter, href: '#' },
    { label: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  const footerLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact Us', href: '#' },
  ];

  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, color: '#ffffff' },
    tap: { scale: 0.9 },
  };
  
  const linkVariants = {
    hover: { color: '#ffffff' },
  };

  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">SSI STUDIOS</h3>
            <p className="text-sm max-w-xs">
              Empowering creativity through innovative design tools and templates.
            </p>
            <a 
              href="https://www.ssinnovations.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Globe size={16} />
              www.ssinnovations.com
            </a>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    variants={linkVariants}
                    whileHover="hover"
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="text-zinc-400"
                >
                  <social.icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SSI STUDIOS v.1.08.25. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
