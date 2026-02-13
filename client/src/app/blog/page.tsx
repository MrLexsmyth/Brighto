import Image from "next/image";
import Link from "next/link";
import axios from "../../../utils/axios";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  images?: string[];
  createdAt: string;
};

async function getBlogs(): Promise<Blog[]> {
  const res = await axios.get("/blogs");
  return res.data;
}

// Helper to generate content snippet
const renderSnippet = (content: string, wordLimit: number) => {
  const plainText = content.replace(/<[^>]*>/g, "");
  const words = plainText.split(" ");
  return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  if (!blogs?.length) {
    return (
      <div className="py-20 text-center text-gray-500">
        No blog posts yet.
      </div>
    );
  }

  // Featured first blog
  const firstBlog = blogs[0];


  // First 20 blogs excluding the first one
 const first20Blogs = blogs.slice(0, 20).slice(1);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog Insights</h1>
        <p className="text-gray-600 text-lg">
          Explore our latest articles and insights on real estate trends.
        </p>
      </div>

      {/* Featured First Blog */}
      <div className="mb-16">
        <Link
          href={`/blog/view/${firstBlog.slug}`}
          className="flex flex-col md:flex-row gap-8 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-300 p-8 rounded-xl border border-blue-100"
        >
          {firstBlog.images?.[0] && (
            <div className="flex-shrink-0 md:w-1/2">
              <Image
                src={firstBlog.images[0]}
                alt={firstBlog.title}
                width={600}
                height={400}
                className="rounded-lg object-cover w-full h-64 md:h-80"
                priority
              />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-block mb-3">
              <span className="bg-[#004274] text-white text-xs font-semibold px-3 py-1 rounded-full">
                Featured Post
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 hover:text-[#004274] transition-colors">
              {firstBlog.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(firstBlog.createdAt).toDateString()}
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              <span className="md:hidden">{renderSnippet(firstBlog.content, 25)}</span>
              <span className="hidden md:block">{renderSnippet(firstBlog.content, 25)}</span>
            </p>

            <div className="flex items-center text-[#004274] font-semibold">
              Read full article
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Recent Articles</h2>
        <div className="h-1 w-20 bg-[#004274] mt-2 rounded"></div>
      </div>

      {/* First 20 Blogs Grid */}
{/* First 20 Blogs Grid */}
<div className="grid grid-cols-3 gap-6 bg-red-500">
  {first20Blogs.map((blog) => (
    <Link
      key={blog._id}
      href={`/blog/view/${blog.slug}`}
      className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {blog.images?.[0] && (
        <div className="w-full h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={blog.images[0]}
            alt={blog.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-3 group-hover:text-[#004274] transition-colors line-clamp-2">
          {blog.title}
        </h2>
        
        <p className="text-gray-500 text-xs mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(blog.createdAt).toDateString()}
        </p>

        <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
          {renderSnippet(blog.content, 60)}
        </p>

        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
          Read more 
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  ))}
</div>
    </div>
  );
}