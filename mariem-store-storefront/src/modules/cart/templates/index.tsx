import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="relative min-h-screen py-12">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-gold/3 rounded-full blur-3xl" />
      </div>
      
      {/* Page Header */}
      <div className="content-container mb-8">
        <div className="text-center max-w-xl mx-auto">
          <h1 
            className="text-3xl md:text-4xl font-light text-grey-90 mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Shopping Cart
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-brand-gold" />
            <div className="w-1.5 h-1.5 rotate-45 bg-brand-gold" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-brand-gold" />
          </div>
        </div>
      </div>
      
      <div className="content-container relative" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_400px] gap-8">
            {/* Cart Items */}
            <div className="flex flex-col gap-y-6">
              {!customer && (
                <>
                  <div className="bg-gradient-to-r from-brand-gold/5 to-transparent rounded-2xl p-6 border border-brand-gold/10">
                    <SignInPrompt />
                  </div>
                  <Divider />
                </>
              )}
              <div className="bg-white rounded-2xl shadow-sm border border-grey-10 p-6">
                <ItemsTemplate cart={cart} />
              </div>
            </div>
            
            {/* Summary */}
            <div className="relative">
              <div className="flex flex-col gap-y-6 sticky top-24">
                {cart && cart.region && (
                  <div className="bg-white rounded-2xl shadow-sm border border-grey-10 p-6">
                    <h2 
                      className="text-lg font-medium text-grey-90 mb-6 pb-4 border-b border-grey-10"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      Order Summary
                    </h2>
                    <Summary cart={cart as any} />
                  </div>
                )}
                
                {/* Trust Badges */}
                <div className="bg-grey-5 rounded-2xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span className="text-xs text-grey-50">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <span className="text-xs text-grey-50">Fast Shipping</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <span className="text-xs text-grey-50">Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
