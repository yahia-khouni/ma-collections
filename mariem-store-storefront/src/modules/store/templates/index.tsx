import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-gold/3 rounded-full blur-3xl" />
      </div>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-grey-5 to-white py-16 mb-8">
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-brand-gold text-sm font-medium tracking-widest uppercase mb-4">
              Our Collection
            </span>
            <h1 
              className="text-4xl md:text-5xl font-light text-grey-90 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
              data-testid="store-page-title"
            >
              All Products
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-gold" />
              <div className="w-2 h-2 rotate-45 border border-brand-gold" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-gold" />
            </div>
            <p className="text-grey-50 mt-4">
              Discover our curated selection of premium fashion pieces
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div
        className="flex flex-col small:flex-row small:items-start py-6 content-container gap-8"
        data-testid="category-container"
      >
        {/* Sidebar */}
        <div className="small:sticky small:top-24 bg-white rounded-2xl p-6 shadow-sm border border-grey-10 small:min-w-[250px]">
          <RefinementList sortBy={sort} />
        </div>
        
        {/* Products Grid */}
        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
