import React from 'react'
import Image from "next/image"
import Link from 'next/link'
import ScrollToTop from "../components/ScrollToTop";

<ScrollToTop />


const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 px-6 py-10 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

       
        <div>
         <Link href="/" aria-label="Go to homepage">
 <Image
  src="/logo4.png"
  alt="Logo"
  width={120}
  height={80}
  className="object-contain w-auto h-auto"
  priority
/>
</Link>

          <p className="mt-4 text-sm leading-relaxed">
            Want to find a <span className="font-bold text-[#00aeff] animate-pulse">HOME </span> ? We are ready to help you find one that suits your lifestyle and need.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Navigation</h2>
          <ul className="space-y-3 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/listings">Listings</Link></li>
            <li><Link href="/agents">Agents</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Services</h2>
          <ul className="space-y-3 text-sm">
            <li>Property Management</li>
            <li>Real Estate Consulting</li>
            <li>Market Analysis</li>
            <li>Investment Advice</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Support</h2>
          <ul className="space-y-3 text-sm">
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Contact Us</h2>
          <ul className="space-y-3 text-sm">
            <li>Email: <a href="mailto:support@bright.com" className="">support@bright.com</a></li>
            <li>
              <a href="tel:+2348169273808" className="">
                Call Us: +234 816 927 3808
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom text */}
      <div className="mt-10 border-t pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} BrightO Estate. All rights reserved. 
      </div>
      <ScrollToTop />
    </footer>
  )
}

export default Footer
