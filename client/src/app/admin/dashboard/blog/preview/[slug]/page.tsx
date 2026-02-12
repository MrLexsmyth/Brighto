'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "../../../../../../../utils/axios";

interface Blog {
  _id: string;
  title: string;
  images?: string[];
  content: string;
  status: string;
  categories?: string[];
  tags?: string[];
  createdAt: string;
}

export default function AdminBlogPreview() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/admin/blogs/slug/${slug}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return <p className="p-10 text-center">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="p-10 text-center">Blog not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      {blog.images && blog.images.length > 0 && (
        <div className="mb-6">
         <Image
  src={blog.images[0]}
  alt={blog.title}
  width={900}       
  height={500}        
  className="w-full h-auto rounded-md object-cover"
  priority
/>

        </div>
      )}

      <div className="flex gap-4 text-sm text-gray-500 mb-6">
        <span>Status: {blog.status}</span>
        <span>
          Created: {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* BLOG CONTENT */}
      <article
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* TAGS */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex gap-2 flex-wrap">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
