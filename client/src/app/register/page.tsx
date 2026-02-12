
'use client';
import NewsletterImage from '../../../public/newsletter.jpg'; 
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import api from '../../../utils/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      setMessage('Registration successful!');
      console.log(res.data);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response: { data: { msg: string } } };
        setMessage(axiosErr.response.data.msg);
      } else {
        setMessage('Registration failed');
      }
    }
  };

  return (
    <div className="w-full h-[400px] flex flex-col md:flex-row">
      {/* Left: Image - hidden on small screens */}
    <div className="hidden md:flex md:w-1/2 h-full relative">
   <Image
  src={NewsletterImage}
  alt="Newsletter"
  fill
  className="object-cover"
  priority
/>

      </div>


      {/* Right: Form */}
     <div className="w-full md:w-1/2 flex items-center justify-center px-4 pt-16 md:pt-0">

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 mt-8">Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full mb-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 w-full mb-4"
          />
          <button type="submit" className="bg-blue text-white px-4 py-2 rounded">
               Register
               </button>
             <p>
               Already have an account? <a href="/login" className="text-red-500 hover:underline">Login</a>
             </p>


          <p className="mt-3 text-sm text-gray-700">{message}</p>
        </form>
      </div>
      
    </div>
);
}
