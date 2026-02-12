'use client';

import Newletter from '../../../../components/Newletter';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';

// Animation Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // Connect to backend/email service here
  };

  return (
    <div>
     
    <section className="px-6 py-16 max-w-7xl mx-auto">
      {/* ---------- Heading ---------- */}
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-4xl font-extrabold text-blue mb-4">Get in Touch</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Have questions, suggestions, or just want to say hi? We&apos;d love to hear from you!
        </p>
      </motion.div>

      {/* ---------- Contact Form & Info ---------- */}
      <motion.div
        className="flex flex-col md:flex-row gap-12 mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* --- Contact Form --- */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 space-y-6"
          variants={fadeUp}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue resize-none"
              placeholder="Tell us something..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#00aeff] text-white px-6 py-3 rounded-md hover:bg-darkblue transition duration-300 mb-1 mt-2"
          >
            <Send size={18} /> Send Message
          </button>
        </motion.form>

        {/* --- Contact Info --- */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          variants={fadeUp}
        >
          <div className="space-y-8 text-gray-700 max-w-md mt-12 md:mt-0">
            <motion.div className="flex items-start gap-4" variants={fadeUp}>
              <Phone className="text-blue w-6 h-6 mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Call Us</h4>
                <p>+234 816 927 3808</p>
              </div>
            </motion.div>

            <motion.div className="flex items-start gap-4" variants={fadeUp}>
              <Mail className="text-blue w-6 h-6 mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Email</h4>
                <p>support@brighto.com</p>
              </div>
            </motion.div>

            <motion.div className="flex items-start gap-4" variants={fadeUp}>
              <MapPin className="text-blue w-6 h-6 mt-1" />
              <div>
                <h4 className="text-lg font-semibold">Location</h4>
                <p>Lagos, Nigeria</p>
              </div>
            </motion.div>

            <motion.div className="pt-4" variants={fadeUp}>
              <h4 className="text-lg font-semibold mb-2">Office Hours</h4>
              <p className="mb-1" >Mon - Fri: 9:00am - 5:00pm</p>
              <p>Sat - Sun: Closed</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
       {/* ---------- Google Map ---------- */}
      <motion.div
        className="w-full h-[400px] "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className="text-xl font-semibold text-center text-blue mb-6 ">
          Find Us on the Map
        </h3>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15827.519038939494!2d3.8757129!3d7.367372250000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10398db489030835%3A0x866512550f119ad2!2sMauve21%20Hotel%20and%20Events%20Center!5e0!3m2!1sen!2sng!4v1751629069325!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-md shadow-md mb-8"
        ></iframe>
      </motion.div>

   
    </section>

    
     
       {/* ---------- Newsletter Section ---------- */}
      <motion.div
      
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <Newletter />
      </motion.div>
    </div>
  );
}
