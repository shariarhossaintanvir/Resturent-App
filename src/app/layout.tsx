import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { BottomNav } from '../components/layout/BottomNav';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/ui/Toast';

export const metadata: Metadata = {
  title: 'FeastHub | Premium Restaurant & Food Delivery Dhaka',
  description: 'Dhaka’s premier gourmet food delivery and table reservation platform. Discover award-winning restaurants, explore mouthwatering menus, and track your orders in real time.',
  keywords: ['food delivery', 'Dhaka restaurant', 'burger', 'kacchi biryani', 'pizza', 'table reservation', 'FeastHub'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F97316',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-primary-500 selection:text-white overflow-x-hidden">
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
