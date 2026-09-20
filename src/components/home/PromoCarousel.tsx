'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  code: string;
  buttonText: string;
  href: string;
  bgGradient: string;
  image: string;
}

const promoSlides: PromoSlide[] = [
  {
    id: 'slide-1',
    badge: 'NEW CUSTOMER SPECIAL',
    title: 'Feast in Style with',
    highlight: '20% OFF',
    subtitle: 'Taste handcrafted burgers, slow-cooked kacchi & wood-fired pizzas.',
    code: 'FIRST20',
    buttonText: 'Order Now',
    href: '/explore',
    bgGradient: 'from-amber-600 via-orange-600 to-rose-700',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'slide-2',
    badge: 'WEEKEND TREAT',
    title: 'Gourmet Platters & Mains',
    highlight: '৳100 OFF',
    subtitle: 'Awadhi dum biryani, smoked ribeyes and tender pasta for your party.',
    code: 'FEAST100',
    buttonText: 'Explore Platters',
    href: '/explore?category=biryani',
    bgGradient: 'from-rose-600 via-red-600 to-amber-700',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'slide-3',
    badge: 'DINE-IN EXPERIENCE',
    title: 'Reserve Premium Tables at',
    highlight: 'Top Restaurants',
    subtitle: 'Zero waiting time. Priority seating at Spice Route, Urban Grill & more.',
    code: 'VIPTABLE',
    buttonText: 'Reserve Table',
    href: '/reservations',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
  },
];

export const PromoCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const slide = promoSlides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl border border-white/10 group">
      <div
        className={`relative w-full min-h-[290px] sm:min-h-[340px] md:min-h-[380px] bg-gradient-to-r ${slide.bgGradient} text-white p-6 sm:p-10 md:p-12 flex flex-col justify-center transition-all duration-700`}
      >
        {/* Background Overlay Image with soft gradient blending */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 opacity-35 md:opacity-90 pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent md:from-black/60 md:via-transparent md:to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-lg space-y-3.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{slide.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {slide.title} <span className="text-amber-300 drop-shadow-sm underline decoration-amber-400/80 decoration-wavy">{slide.highlight}</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-md font-medium">
            {slide.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href={slide.href}>
              <Button
                variant="primary"
                size="md"
                className="bg-white text-slate-950 hover:bg-amber-100 hover:text-black font-extrabold shadow-lg shadow-black/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {slide.buttonText}
              </Button>
            </Link>

            <button
              onClick={() => handleCopyCode(slide.code)}
              className="px-3.5 py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 text-xs font-mono text-white flex items-center gap-2 transition-all active:scale-95"
              title="Click to copy promo code"
            >
              <span className="text-slate-300">Code:</span>
              <span className="font-black text-amber-300 tracking-wider">{slide.code}</span>
              <span className="text-[10px] text-white/80 bg-white/20 px-1.5 py-0.5 rounded-md">
                {copiedCode === slide.code ? 'Copied! ✓' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-2xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 rounded-2xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-5 left-6 sm:left-10 z-20 flex items-center gap-1.5">
          {promoSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-white shadow-md' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
