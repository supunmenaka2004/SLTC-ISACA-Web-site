import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "ISACA Student Group | Sri Lanka Technology Campus",
  description: "Official web portal of ISACA Student Group. A student-driven community focused on cybersecurity, technology, innovation, knowledge sharing and responsible digital practices.",
  keywords: ["ISACA", "ISACA Student Group", "Cybersecurity", "University Technology Club", "IT Audit", "Digital Safety", "Student Community"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark scroll-smooth"
    >
      <body className="min-h-screen flex flex-col bg-[#02060d] text-slate-100 antialiased font-sans">
        <ThemeProvider>
          <Preloader />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
