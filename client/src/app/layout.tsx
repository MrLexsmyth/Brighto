import type { Metadata } from "next";
import Script from 'next/script';
import Navbar from "../../components/Navbar";
import 'leaflet/dist/leaflet.css';
import Footer from "../../components/Footer";
import { Poppins } from "next/font/google";
import "./globals.css";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bright",
  description: "Find your next home with Bright",
  metadataBase: new URL("https://brighto.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  openGraph: {
    title: "BrightO",
    description: "Find your next home with Bright",
    url: "https://brighto.vercel.app", 
    siteName: "BrightO",
    images: [
      {
        url: "/metadata.jpg",
        width: 1200,
        height: 630,
        alt: "Bright - Find your next home",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "BrightO",
    description: "Find your next home with BrightO",
    images: ["/metadata.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
         
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="beforeInteractive" />
        <Navbar  />
        <main className="mt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}