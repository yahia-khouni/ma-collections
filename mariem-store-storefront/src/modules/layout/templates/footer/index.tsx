import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="relative w-full bg-grey-90 text-white overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      
      <div className="content-container relative z-10">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-brand-gold text-xs uppercase tracking-[0.3em] mb-4 block">Stay Updated</span>
            <h3 className="text-3xl small:text-4xl font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Join Our Newsletter
            </h3>
            <p className="text-grey-40 mb-8 text-sm">
              Subscribe to receive updates on new arrivals, exclusive offers, and style tips.
            </p>
            <form className="flex flex-col small:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-grey-50 focus:outline-none focus:border-brand-gold/50 transition-colors"
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-brand-gold text-grey-90 rounded-full font-medium hover:bg-brand-gold-light transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 small:grid-cols-2 large:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="small:col-span-2 large:col-span-1">
            <LocalizedClientLink href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-xl flex items-center justify-center transform rotate-45 group-hover:rotate-[50deg] transition-transform duration-500">
                <span className="text-white font-bold text-xl transform -rotate-45" style={{ fontFamily: 'Playfair Display, serif' }}>M</span>
              </div>
              <div>
                <span className="text-xl font-semibold tracking-wide text-white" style={{ fontFamily: 'Playfair Display, serif' }}>M&A</span>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-grey-40">Collections</span>
              </div>
            </LocalizedClientLink>
            <p className="text-grey-40 text-sm leading-relaxed mb-6 max-w-xs">
              Découvrez l'élégance tunisienne. Des vêtements de qualité premium pour hommes et femmes, conçus avec passion.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-gold/20 border border-white/10 hover:border-brand-gold/50 flex items-center justify-center transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <svg className="w-4 h-4 text-grey-40 group-hover:text-brand-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          {productCategories && productCategories?.length > 0 && (
            <div>
              <h4 className="text-brand-gold text-xs uppercase tracking-[0.2em] mb-6 font-medium">Categories</h4>
              <ul className="space-y-3">
                {productCategories?.slice(0, 6).map((c) => {
                  if (c.parent_category) return null
                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-grey-40 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                        href={`/categories/${c.handle}`}
                      >
                        <span className="w-0 h-[1px] bg-brand-gold group-hover:w-3 transition-all duration-300" />
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h4 className="text-brand-gold text-xs uppercase tracking-[0.2em] mb-6 font-medium">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Store', href: '/store' },
                { name: 'Account', href: '/account' },
                { name: 'Cart', href: '/cart' },
              ].map((link) => (
                <li key={link.name}>
                  <LocalizedClientLink
                    className="text-grey-40 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                    href={link.href}
                  >
                    <span className="w-0 h-[1px] bg-brand-gold group-hover:w-3 transition-all duration-300" />
                    {link.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-brand-gold text-xs uppercase tracking-[0.2em] mb-6 font-medium">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-grey-40 text-sm group">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/10 transition-colors">
                  <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="pt-1">ISSAT Kasserine, Tunisia</span>
              </li>
              <li>
                <a href="tel:+21600000000" className="flex items-start gap-3 text-grey-40 hover:text-white text-sm transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/10 transition-colors">
                    <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="pt-1">+216 00 000 000</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@macollections.tn" className="flex items-start gap-3 text-grey-40 hover:text-white text-sm transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/10 transition-colors">
                    <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="pt-1">contact@macollections.tn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col small:flex-row items-center justify-between gap-4">
          <Text className="text-grey-50 text-xs">
            © {new Date().getFullYear()} M&A Collections. All rights reserved.
          </Text>
          <div className="flex items-center gap-6">
            <a href="#" className="text-grey-50 hover:text-white text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-grey-50 hover:text-white text-xs transition-colors">Terms of Service</a>
          </div>
          <Text className="text-grey-50 text-xs flex items-center gap-2">
            Made with <span className="text-red-500 animate-pulse">❤</span> in Tunisia
          </Text>
        </div>
      </div>
    </footer>
  )
}
