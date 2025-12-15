"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    title: "Elevate Your Style",
    subtitle: "Discover timeless elegance with M&A Collections",
    cta: { text: "Shop Collection", href: "/store" },
    ctaSecondary: { text: "Explore Men", href: "/categories/hommes" },
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
    title: "New Season Arrivals",
    subtitle: "Premium clothing crafted for the modern individual",
    cta: { text: "Shop Women", href: "/categories/femmes" },
    ctaSecondary: { text: "View All", href: "/store" },
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    title: "Premium Quality",
    subtitle: "Handcrafted with passion, designed for you",
    cta: { text: "Discover T-Shirts", href: "/categories/t-shirts" },
    ctaSecondary: { text: "Browse Shirts", href: "/categories/chemises" },
  },
]

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setProgress(0)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [isTransitioning])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }, [currentSlide, goToSlide])

  // Auto-advance slides with progress
  useEffect(() => {
    const duration = 6000
    const interval = 50
    const increment = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="h-[100vh] w-full relative overflow-hidden bg-grey-90">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-110"
          }`}
        >
          {/* Background Image with Ken Burns effect */}
          <div className={`absolute inset-0 ${index === currentSlide ? "animate-ken-burns" : ""}`}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
          </div>
          
          {/* Sophisticated overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          
          {/* Noise texture overlay for luxury feel */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)" /%3E%3C/svg%3E")' }} />
        </div>
      ))}

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-brand-gold/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-40 right-32 w-24 h-24 border border-brand-gold/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-2 h-2 bg-brand-gold/40 rounded-full animate-pulse-glow" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 small:px-16 large:px-32">
        <div className="max-w-3xl">
          {/* Brand badge with line */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-gradient-to-r from-brand-gold to-transparent" />
            <span className="text-brand-gold text-xs uppercase tracking-[0.4em] font-medium">
              Premium Fashion • Tunisia
            </span>
          </div>
          
          {/* Title with elegant animation */}
          <div className="overflow-hidden mb-6">
            <h1
              className={`text-5xl small:text-6xl large:text-7xl xl:text-8xl text-white font-light tracking-tight transition-all duration-700 ease-out ${
                isTransitioning ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
              }`}
              style={{ fontFamily: 'Playfair Display, serif', lineHeight: '1.1' }}
            >
              {slides[currentSlide].title}
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className="overflow-hidden mb-10">
            <p className={`text-lg small:text-xl large:text-2xl text-white/70 font-light max-w-xl transition-all duration-700 delay-100 ${
              isTransitioning ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
            }`}>
              {slides[currentSlide].subtitle}
            </p>
          </div>
          
          {/* CTAs with luxury styling */}
          <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-200 ${
            isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
          }`}>
            <LocalizedClientLink href={slides[currentSlide].cta.href}>
              <button className="group relative px-10 py-4 bg-brand-gold overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold-light to-brand-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10 text-grey-90 font-medium tracking-wide flex items-center gap-3">
                  {slides[currentSlide].cta.text}
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </LocalizedClientLink>
            <LocalizedClientLink href={slides[currentSlide].ctaSecondary.href}>
              <button className="group relative px-10 py-4 border border-white/30 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white font-medium tracking-wide flex items-center gap-3 group-hover:text-white transition-colors">
                  {slides[currentSlide].ctaSecondary.text}
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      <div className="absolute right-8 small:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? "bg-brand-gold" 
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <span className="absolute inset-0 rounded-full animate-ping bg-brand-gold/50" />
            )}
          </button>
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-light transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between px-8 small:px-16 large:px-32 py-6 bg-gradient-to-t from-black/50 to-transparent">
          {/* Arrow Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="group w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-300"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5 text-white/70 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="group w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-300"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5 text-white/70 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Slide counter */}
            <div className="ml-4 flex items-center gap-2 text-white/50 text-sm font-light">
              <span className="text-brand-gold font-medium text-lg">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="w-8 h-[1px] bg-white/30" />
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="hidden large:flex items-center gap-8 text-white/60 text-sm">
            <span className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold/30 transition-colors">
                <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Free Shipping 100+ TND
            </span>
            <span className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold/30 transition-colors">
                <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              Premium Quality
            </span>
            <span className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold/30 transition-colors">
                <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              Made in Tunisia
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 hidden small:flex flex-col items-center gap-2 animate-bounce-subtle">
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-brand-gold rounded-full animate-scroll-down" />
        </div>
      </div>

      <style jsx>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 7s ease-out forwards;
        }
        @keyframes scroll-down {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.5; }
        }
        .animate-scroll-down {
          animation: scroll-down 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroCarousel
