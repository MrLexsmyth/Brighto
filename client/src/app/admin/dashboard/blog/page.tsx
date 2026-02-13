'use client'

import { useEffect, useState } from "react";
import axios from "../../../../../utils/axios"; // adjust path if needed
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/admin/blogs"); // your admin API route
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading blogs...</p>;

  if (!blogs.length)
    return <p className="p-10 text-center">No blogs found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Blogs</h1>
        <Link
          href="/admin/dashboard/blog/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + New Blog
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Category</th>
            <th className="border p-2 text-left">Created At</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border p-2">
  <Link
    href={`/admin/dashboard/blog/preview/${blog.slug}`}
    className="font-medium text-blue-600 hover:underline"
  >
    {blog.title}
  </Link>
</td>

              <td className="border p-2 capitalize">{blog.status}</td>
              <td className="border p-2">{blog.category }</td>
              <td className="border p-2">{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td className="border p-2 space-x-2">
                <Link
                  href={`/admin/blogs/edit/${blog.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => alert("Delete functionality coming soon")}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
