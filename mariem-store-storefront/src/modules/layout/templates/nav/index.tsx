import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-20 mx-auto duration-300 bg-white/95 backdrop-blur-md border-b border-grey-10 shadow-sm">
        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
        
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Left - Menu */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="group flex flex-col items-center gap-1"
              data-testid="nav-store-link"
            >
              <div className="flex items-center gap-2">
                {/* Logo icon */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-lg transform rotate-45 group-hover:rotate-[50deg] transition-transform duration-500" />
                  <span className="relative text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>M</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xl font-semibold tracking-wide text-grey-90 group-hover:text-brand-gold transition-colors duration-300" style={{ fontFamily: 'Playfair Display, serif' }}>
                    M&A
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-grey-50 -mt-1">Collections</span>
                </div>
              </div>
            </LocalizedClientLink>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {/* Search button */}
            <button className="hidden small:flex items-center justify-center w-10 h-10 rounded-full hover:bg-grey-10 transition-colors duration-300 group">
              <svg className="w-5 h-5 text-grey-60 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Account */}
            <LocalizedClientLink
              className="hidden small:flex items-center justify-center w-10 h-10 rounded-full hover:bg-grey-10 transition-colors duration-300 group"
              href="/account"
              data-testid="nav-account-link"
            >
              <svg className="w-5 h-5 text-grey-60 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </LocalizedClientLink>
            
            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-grey-10 transition-colors duration-300 relative group"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg className="w-5 h-5 text-grey-60 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-white text-xs flex items-center justify-center rounded-full">0</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
