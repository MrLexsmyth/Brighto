'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import api from '../../../utils/axios';
import LoginImage from '../../../public/newsletter.jpg'; // Replace with your actual image

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', form);

    // ✅ Store user info and token in localStorage
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);

    setMessage('Login successful!');
    console.log(res.data);

    // ✅ Optional redirect to dashboard or homepage
    window.location.href = '/'; // Change this route as needed
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const axiosErr = err as { response: { data: { msg: string } } };
      setMessage(axiosErr.response.data.msg);
    } else {
      setMessage('Login failed');
    }
  }
};

  

  return (
    <div className="w-full h-[400px] flex flex-col md:flex-row">
      {/* Left: Image (hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 h-full relative">
        <Image
          src={LoginImage}
          alt="Login Visual"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 pt-16 md:pt-0">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

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
          <button type="submit" className="bg-blue text-white px-4 py-2 rounded w-full">
            Login
          </button>

          <p className="mt-3 text-sm text-gray-700">{message}</p>
          <p className="mt-4 text-sm">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
