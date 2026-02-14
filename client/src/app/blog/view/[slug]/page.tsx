import Image from "next/image";
import api from "../../../../../utils/axios";
import { notFound } from "next/navigation";
import Link from "next/link";



type Blog = {
  title: string;
  content: string;
  images?: string[];
    tags?: string[];
  createdAt: string;
};

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await api.get(`/blogs/slug/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; 
  const blog = await getBlog(slug);

  if (!blog) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link 
          href="/estate/blog" 
          className="inline-flex items-center text-[#004274] hover:text-[#004274] transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* Hero Image */}
      {blog.images && blog.images.length > 0 && (
        <div className="w-full h-[350px] md:h-[500px] relative">
          <Image
            src={blog.images[0]}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Article Header */}
        <header className={`mb-12 ${blog.images && blog.images.length > 0 ? '-mt-32 relative z-10' : ''}`}>
          <div className={`${blog.images && blog.images.length > 0 ? 'bg-white rounded-2xl shadow-xl p-8 md:p-12' : ''}`}>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
            </div>

            <h1 className={`font-bold leading-tight ${blog.images && blog.images.length > 0 ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>
              {blog.title}
            </h1>
          </div>
        </header>

        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-[#004274] 
              prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

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

        {/* Share Section
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Share this article</h3>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

// Metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.content.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.replace(/<[^>]*>/g, "").slice(0, 160),
      images: blog.images?.[0] ? [blog.images[0]] : [],
    },
  };
}