import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div 
        data-testid="product-wrapper"
        className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-grey-90/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Quick View Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="px-6 py-2 bg-white/95 backdrop-blur-sm text-grey-90 text-sm font-medium rounded-full shadow-lg">
              View Details
            </span>
          </div>
          
          {/* Gold accent corner */}
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-brand-gold/10 transform rotate-45 translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-gold/20 transition-colors duration-500" />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <Text 
            className="text-grey-90 font-medium text-sm line-clamp-1 group-hover:text-brand-gold transition-colors duration-300" 
            data-testid="product-title"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {product.title}
          </Text>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-x-2">
              {cheapestPrice && (
                <span className="text-brand-gold font-semibold">
                  <PreviewPrice price={cheapestPrice} />
                </span>
              )}
            </div>
            {/* Decorative line */}
            <div className="h-px w-8 bg-gradient-to-r from-brand-gold to-transparent group-hover:w-12 transition-all duration-500" />
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
