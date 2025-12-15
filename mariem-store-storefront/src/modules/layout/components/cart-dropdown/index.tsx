"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full flex items-center">
        <PopoverButton className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-grey-10 transition-colors duration-300 group">
          <svg className="w-5 h-5 text-grey-60 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-gold text-white text-[10px] font-semibold flex items-center justify-center rounded-full px-1">
              {totalItems}
            </span>
          )}
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-2 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-2 scale-95"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+12px)] right-0 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-grey-10 w-[420px] text-grey-90 overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            {/* Header */}
            <div className="p-5 border-b border-grey-10 bg-gradient-to-r from-grey-5 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>Shopping Cart</h3>
                <span className="text-xs text-grey-50">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
            
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[350px] px-5 py-4 space-y-4 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="flex gap-4 p-3 rounded-xl bg-grey-5 hover:bg-grey-10 transition-colors duration-300"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden ring-1 ring-grey-10">
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                          </div>
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <LocalizedClientLink
                              href={`/products/${item.product_handle}`}
                              data-testid="product-link"
                              className="text-sm font-medium text-grey-90 hover:text-brand-gold transition-colors line-clamp-1"
                            >
                              {item.title}
                            </LocalizedClientLink>
                            <div className="text-xs text-grey-50 mt-1">
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                            </div>
                            <span className="text-xs text-grey-40" data-testid="cart-item-quantity" data-value={item.quantity}>
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <DeleteButton
                              id={item.id}
                              className="text-xs text-grey-40 hover:text-red-500 transition-colors"
                              data-testid="cart-item-remove-button"
                            >
                              Remove
                            </DeleteButton>
                            <div className="text-sm font-semibold text-brand-gold">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* Footer */}
                <div className="p-5 border-t border-grey-10 bg-gradient-to-r from-grey-5 to-white space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-grey-60">
                      Subtotal <span className="text-xs text-grey-40">(excl. taxes)</span>
                    </span>
                    <span
                      className="text-lg font-semibold text-grey-90"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref className="block">
                    <button
                      className="w-full py-3 px-6 bg-brand-gold hover:bg-brand-gold-light text-grey-90 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/20"
                      data-testid="go-to-cart-button"
                    >
                      View Cart & Checkout
                    </button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="py-12 px-5">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-grey-5 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-grey-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-grey-60 mb-4">Your cart is empty</p>
                  <LocalizedClientLink href="/store">
                    <button 
                      onClick={close}
                      className="px-6 py-2 bg-brand-gold hover:bg-brand-gold-light text-grey-90 font-medium rounded-full transition-all duration-300 text-sm"
                    >
                      Start Shopping
                    </button>
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
