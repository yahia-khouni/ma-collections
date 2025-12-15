import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="h-[85vh] w-full border-b border-ui-border-base relative bg-gradient-to-br from-grey-90 via-grey-80 to-grey-90">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
      </div>
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-8 px-4">
        {/* Brand badge */}
        <span className="text-brand-gold txt-compact-small uppercase tracking-[0.3em] font-medium">
          Premium Fashion • Tunisia
        </span>
        
        <span>
          <Heading
            level="h1"
            className="text-4xl small:text-6xl leading-tight text-white font-light tracking-tight"
          >
            Elevate Your Style
          </Heading>
          <Heading
            level="h2"
            className="text-xl small:text-2xl leading-relaxed text-grey-40 font-light mt-4 max-w-2xl"
          >
            Discover timeless elegance with M&A Collections — premium clothing crafted for the modern individual.
          </Heading>
        </span>
        
        <div className="flex gap-4 mt-4">
          <LocalizedClientLink href="/store">
            <Button 
              variant="secondary"
              className="bg-brand-gold text-grey-90 hover:bg-brand-gold-light border-none px-8 py-3 font-medium"
            >
              Shop Collection
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/categories/hommes">
            <Button 
              variant="secondary"
              className="bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/10 px-8 py-3"
            >
              Explore Men
            </Button>
          </LocalizedClientLink>
        </div>
        
        {/* Trust badges */}
        <div className="flex items-center gap-8 mt-8 text-grey-50 txt-compact-small">
          <span className="flex items-center gap-2">
            <span className="text-brand-gold">✓</span> Free Shipping over 100 TND
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brand-gold">✓</span> Premium Quality
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brand-gold">✓</span> Made in Tunisia
          </span>
        </div>
      </div>
    </div>
  )
}

export default Hero
