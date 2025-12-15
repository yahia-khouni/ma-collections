import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-6 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-light transition-colors duration-300 tracking-widest uppercase"
          >
            <span className="w-6 h-px bg-brand-gold" />
            {product.collection.title}
          </LocalizedClientLink>
        )}
        
        <div>
          <Heading
            level="h2"
            className="text-3xl md:text-4xl leading-tight text-grey-90"
            data-testid="product-title"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {product.title}
          </Heading>
          
          {/* Decorative element */}
          <div className="flex items-center gap-3 mt-4">
            <div className="h-px w-8 bg-gradient-to-r from-brand-gold to-transparent" />
            <div className="w-1.5 h-1.5 rotate-45 bg-brand-gold" />
          </div>
        </div>

        <Text
          className="text-grey-50 leading-relaxed whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
        
        {/* Trust indicators */}
        <div className="flex items-center gap-6 pt-4 border-t border-grey-10">
          <div className="flex items-center gap-2 text-xs text-grey-40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Premium Quality</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-grey-40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Fast Shipping</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-grey-40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
