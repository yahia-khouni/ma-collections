import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import HeroCarousel from "@modules/home/components/hero/carousel"
import CategoriesShowcase from "@modules/home/components/categories-showcase"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "M&A Collections | Premium Fashion Tunisia",
  description:
    "Découvrez l'élégance tunisienne. Des vêtements de qualité premium pour hommes et femmes.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const [{ collections }, categories, productsResponse] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    listCategories(),
    listProducts({ 
      countryCode, 
      queryParams: { 
        limit: 100,
        fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories",
      } 
    }),
  ])

  return (
    <>
      <HeroCarousel />
      
      {/* Categories with products showcase */}
      {categories && region && (
        <CategoriesShowcase
          categories={categories}
          products={productsResponse.response.products}
          region={region}
        />
      )}

      {/* Featured collections */}
      {collections && region && collections.length > 0 && (
        <div className="py-16 bg-white">
          <div className="content-container">
            <div className="text-center mb-12">
              <span className="text-brand-gold txt-compact-small uppercase tracking-[0.2em] font-medium">
                Featured
              </span>
              <h2 className="text-3xl small:text-4xl font-light mt-2 text-grey-90">
                Our Collections
              </h2>
            </div>
            <ul className="flex flex-col gap-x-6">
              <FeaturedProducts collections={collections} region={region} />
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
