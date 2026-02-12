import type { Metadata } from "next";
import Script from 'next/script';
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
  metadataBase: new URL("http://localhost:3000"), 
  openGraph: {
    title: "BrightO",
    description: "Find your next home with Bright",
    url: "http://localhost:3000",
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
      <body>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="beforeInteractive" />
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}