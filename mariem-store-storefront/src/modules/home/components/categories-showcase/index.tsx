import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

// Category images mapping
const categoryImages: Record<string, string> = {
  hommes: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
  femmes: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
  "t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  chemises: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  pantalons: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  vestes: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
}

// Define category order for display
const categoryOrder = ["t-shirts", "chemises", "pantalons", "vestes", "hommes", "femmes"]

type CategoriesShowcaseProps = {
  categories: HttpTypes.StoreProductCategory[]
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

export default function CategoriesShowcase({
  categories,
  products,
  region,
}: CategoriesShowcaseProps) {
  // Filter and sort categories - exclude default and internal categories
  const displayCategories = categories
    .filter((cat) => {
      const handle = cat.handle?.toLowerCase() || ""
      return (
        handle !== "default-category" &&
        !handle.includes("default")
      )
    })
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.handle || "")
      const bIndex = categoryOrder.indexOf(b.handle || "")
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

  // Get products by category
  const getProductsForCategory = (categoryId: string) => {
    return products
      .filter((product) =>
        product.categories?.some((cat) => cat.id === categoryId)
      )
      .slice(0, 4)
  }

  // Separate into "clothing type" categories and "gender" categories
  const clothingCategories = displayCategories.filter((cat) =>
    ["t-shirts", "chemises", "pantalons", "vestes"].includes(cat.handle || "")
  )
  const genderCategories = displayCategories.filter((cat) =>
    ["hommes", "femmes"].includes(cat.handle || "")
  )

  return (
    <section className="py-24 bg-gradient-to-b from-white via-grey-5 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="content-container relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-brand-gold" />
            <span className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium">
              Curated Collections
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-brand-gold" />
          </div>
          <h2 className="text-4xl small:text-5xl font-light text-grey-90 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shop by Category
          </h2>
          <p className="text-grey-50 text-lg max-w-xl mx-auto font-light">
            Explore our carefully selected pieces designed for the modern lifestyle
          </p>
        </div>

        {/* Gender categories - large feature cards */}
        {genderCategories.length > 0 && (
          <div className="grid grid-cols-1 medium:grid-cols-2 gap-8 mb-20">
            {genderCategories.map((category, index) => {
              const categoryProducts = getProductsForCategory(category.id)
              const categoryImage = categoryImages[category.handle || ""] || categoryImages["hommes"]

              return (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className="group relative h-[500px] rounded-3xl overflow-hidden"
                >
                  {/* Image with parallax-like effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={categoryImage}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Sophisticated overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-brand-gold/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                  <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-brand-gold/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 small:p-10">
                    <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-4">
                      <span className="text-brand-gold text-xs uppercase tracking-[0.2em] mb-3 block">
                        Collection
                      </span>
                      <h3 className="text-white text-4xl small:text-5xl font-light mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {category.name}
                      </h3>
                      <p className="text-white/60 text-sm mb-6 max-w-xs">
                        {categoryProducts.length} exclusive pieces curated for you
                      </p>
                      <span className="inline-flex items-center gap-3 text-white group-hover:text-brand-gold transition-colors duration-300">
                        <span className="text-sm font-medium tracking-wide uppercase">Explore Collection</span>
                        <span className="w-10 h-10 rounded-full border border-white/30 group-hover:border-brand-gold group-hover:bg-brand-gold/10 flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </span>
                    </div>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        )}

        {/* Clothing type categories - grid with products */}
        {clothingCategories.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-gradient-to-b from-brand-gold to-brand-gold-dark rounded-full" />
                <div>
                  <h3 className="text-2xl small:text-3xl font-light text-grey-90" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Shop by Type
                  </h3>
                  <p className="text-grey-50 text-sm mt-1">Find your perfect style</p>
                </div>
              </div>
              <LocalizedClientLink
                href="/store"
                className="group flex items-center gap-3 px-6 py-3 rounded-full border border-grey-20 hover:border-brand-gold hover:bg-brand-gold/5 transition-all duration-300"
              >
                <span className="text-grey-70 group-hover:text-brand-gold transition-colors text-sm font-medium">
                  View All Products
                </span>
                <svg className="w-4 h-4 text-grey-40 group-hover:text-brand-gold transition-colors transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </LocalizedClientLink>
            </div>

            <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-4 gap-6">
              {clothingCategories.map((category, index) => {
                const categoryProducts = getProductsForCategory(category.id)
                const categoryImage = categoryImages[category.handle || ""] || categoryImages["t-shirts"]

                return (
                  <div
                    key={category.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Category header with image */}
                    <LocalizedClientLink href={`/categories/${category.handle}`}>
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={categoryImage}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-brand-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute bottom-5 left-5 right-5">
                          <h4 className="text-white text-2xl font-light mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {category.name}
                          </h4>
                          <p className="text-white/60 text-xs uppercase tracking-wider">
                            {categoryProducts.length} items
                          </p>
                        </div>
                      </div>
                    </LocalizedClientLink>

                    {/* Products preview */}
                    {categoryProducts.length > 0 ? (
                      <div className="p-5">
                        <div className="grid grid-cols-2 gap-4">
                          {categoryProducts.slice(0, 2).map((product) => {
                            const { cheapestPrice } = getProductPrice({ product })
                            return (
                              <LocalizedClientLink
                                key={product.id}
                                href={`/products/${product.handle}`}
                                className="group/product"
                              >
                                <div className="aspect-square rounded-xl overflow-hidden bg-grey-5 mb-3 ring-1 ring-grey-10 group-hover/product:ring-brand-gold/30 transition-all duration-300">
                                  <Thumbnail
                                    thumbnail={product.thumbnail}
                                    images={product.images}
                                    size="small"
                                  />
                                </div>
                                <p className="text-grey-90 text-sm font-medium truncate group-hover/product:text-brand-gold transition-colors duration-300">
                                  {product.title}
                                </p>
                                {cheapestPrice && (
                                  <p className="text-brand-gold text-sm font-semibold mt-1">
                                    {cheapestPrice.calculated_price}
                                  </p>
                                )}
                              </LocalizedClientLink>
                            )
                          })}
                        </div>
                        
                        {categoryProducts.length > 2 && (
                          <LocalizedClientLink
                            href={`/categories/${category.handle}`}
                            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-grey-5 text-grey-60 text-sm hover:bg-brand-gold/10 hover:text-brand-gold transition-all duration-300"
                          >
                            <span>+{categoryProducts.length - 2} more</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </LocalizedClientLink>
                        )}
                      </div>
                    ) : (
                      <div className="p-5 text-center">
                        <p className="text-grey-40 text-sm italic">Coming soon</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Quick links with enhanced styling */}
        <div className="mt-24 pt-16 border-t border-grey-10">
          <div className="text-center mb-10">
            <h3 className="text-xl font-light text-grey-90" style={{ fontFamily: 'Playfair Display, serif' }}>
              Quick Access
            </h3>
            <p className="text-grey-50 text-sm mt-2">Jump directly to your favorite category</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {displayCategories.map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="group px-6 py-3 bg-white rounded-full border border-grey-10 text-grey-60 hover:border-brand-gold hover:text-brand-gold hover:shadow-lg hover:shadow-brand-gold/10 transition-all duration-300 text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  {category.name}
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
