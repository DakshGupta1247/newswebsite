import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { NewsProvider } from "@/contexts/NewsContext";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NewsHub - Your Modern News Platform",
  description: "Stay informed with the latest news from around the world. Personalized, responsive, and real-time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <NewsProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <main className="container mx-auto px-4 py-8">
                  {children}
                </main>
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                  },
                }}
              />
            </NewsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
