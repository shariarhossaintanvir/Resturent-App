import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { BottomNav } from '../components/layout/BottomNav';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/ui/Toast';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FeastHub | Premium Restaurant & Food Delivery Dhaka',
  description: 'Dhaka’s premier gourmet food delivery and table reservation platform. Discover award-winning restaurants, explore mouthwatering menus, and track your orders in real time.',
  keywords: ['food delivery', 'Dhaka restaurant', 'burger', 'kacchi biryani', 'pizza', 'table reservation', 'FeastHub'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF5A1F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-primary-500 selection:text-white overflow-x-hidden">
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-12">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

