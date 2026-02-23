import Image from "next/image";
import NewsletterImage from "../public/newsletter.jpg";

const Newsletter = () => {
  return (
    <section className="w-full flex flex-col md:flex-row">
      
      
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 md:px-12 bg-darkblue">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Subscribe to Our Newsletter
        </h1>

        <p className="text-sm sm:text-base text-white/90 mb-6 max-w-lg">
          Subscribe to our newsletter to get the latest updates and property
          listings directly in your inbox.
        </p>

        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 sm:gap-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none text-black"
          />
          <button className="bg-[#00aeff] hover:bg-[#0090d2] text-white px-6 py-3 rounded-md sm:rounded-r-md sm:rounded-l-none font-semibold transition-colors duration-300">
            Subscribe
          </button>
        </div>
      </div>

   
      <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-[400px]">
        <Image
          src={NewsletterImage}
          alt="Newsletter"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

    </section>
  );
};

export default Newsletter;