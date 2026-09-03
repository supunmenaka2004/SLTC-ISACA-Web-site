import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ISACA Student Group | Sri Lanka Technology Campus",
  description: "Official web portal of ISACA Student Group. A student-driven community focused on cybersecurity, technology, innovation, knowledge sharing and responsible digital practices.",
  keywords: ["ISACA", "ISACA Student Group", "ICASA", "Cybersecurity", "University Technology Club", "IT Audit", "Digital Safety", "Student Community"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geist.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#02060d] text-slate-100 antialiased font-sans">
        <Preloader />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
