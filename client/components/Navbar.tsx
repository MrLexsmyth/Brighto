'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <nav className="font-jakarta w-full bg-white dark:bg-gray-900 text-darkblue shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo4.png"
            alt="Logo"
            width={120}
            height={80}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+2348169273808" className="text-sm">
            Call Us: +2348169273808
          </a>
          <button onClick={toggleDarkMode} className="text-white ml-2">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleDarkMode} className="mr-3 text-white">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-darkblue dark:text-white">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 text-darkblue dark:text-white px-4 pb-6 pt-4 space-y-4 shadow transition-all">
          <NavLinks mobile closeMenu={() => setIsOpen(false)} />
          <div className="pt-4 border-t border-gray-300 dark:border-gray-700 space-y-3">
            <a href="tel:+2348169273808" className="block text-sm">
              Call Us: +2348169273808
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// NavLinks Component
const NavLinks = ({
  mobile = false,
  closeMenu,
}: {
  mobile?: boolean;
  closeMenu?: () => void;
}) => {
  const baseClasses = mobile ? 'block py-1 text-sm' : 'text-sm';
  const hoverClass = 'hover:text-[#00aeff] dark:hover:text-[#00aeff] transition';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/listings', label: 'Listings' },
    { href: '/agents', label: 'Our Agents' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${baseClasses} ${hoverClass}`}
          onClick={closeMenu}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
