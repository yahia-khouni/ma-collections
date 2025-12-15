"use client"

import { ArrowRightMini, XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

const SideMenuItems = [
  { name: "Home", href: "/", icon: "" },
  { name: "Store", href: "/store", icon: "" },
  { name: "Account", href: "/account", icon: "" },
  { name: "Cart", href: "/cart", icon: "" },
]

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const menuContent = (
    <>
      {/* Backdrop with blur */}
      <div
        onClick={() => setIsOpen(false)}
        data-testid="side-menu-backdrop"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s ease-in-out",
        }}
      />

      {/* Side Panel */}
      <div
        data-testid="nav-menu-popup"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "min(420px, 90vw)",
          height: "100vh",
          background: "linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
          zIndex: 9999,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: isOpen ? "10px 0 60px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-30%",
          width: "80%",
          height: "80%",
          background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Header with logo and close button */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "28px 32px",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
          flexShrink: 0,
          position: "relative",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              background: "linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(45deg)",
              boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
            }}>
              <span style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Playfair Display, serif",
                transform: "rotate(-45deg)",
              }}>M</span>
            </div>
            <div>
              <span style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "600",
                fontFamily: "Playfair Display, serif",
                letterSpacing: "0.5px",
              }}>M&A</span>
              <span style={{
                display: "block",
                color: "#D4AF37",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginTop: "-2px",
              }}>Collections</span>
            </div>
          </div>
          
          {/* Close button */}
          <button
            data-testid="close-menu-button"
            onClick={() => setIsOpen(false)}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212,175,55,0.2)"
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
            }}
          >
            <XMark />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{
          flex: 1,
          padding: "40px 24px",
          overflowY: "auto",
          position: "relative",
        }}>
          <p style={{
            color: "#D4AF37",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            marginBottom: "24px",
            paddingLeft: "8px",
          }}>Navigation</p>
          
          <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {SideMenuItems.map(({ name, href, icon }, index) => (
              <li key={name}>
                <LocalizedClientLink
                  href={href}
                  onClick={() => setIsOpen(false)}
                  data-testid={`${name.toLowerCase()}-link`}
                  onMouseEnter={() => setHoveredItem(name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    textDecoration: "none",
                    background: hoveredItem === name ? "rgba(212,175,55,0.1)" : "transparent",
                    border: hoveredItem === name ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
                    transition: "all 0.3s ease",
                    transform: hoveredItem === name ? "translateX(8px)" : "translateX(0)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{
                      fontSize: "24px",
                      opacity: hoveredItem === name ? 1 : 0.7,
                      transition: "opacity 0.3s ease",
                    }}>{icon}</span>
                    <span style={{
                      fontSize: "1.5rem",
                      fontWeight: "300",
                      color: hoveredItem === name ? "#D4AF37" : "white",
                      fontFamily: "Playfair Display, serif",
                      transition: "color 0.3s ease",
                    }}>
                      {name}
                    </span>
                  </div>
                  <ArrowRightMini style={{
                    color: hoveredItem === name ? "#D4AF37" : "rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    transform: hoveredItem === name ? "translateX(4px)" : "translateX(0)",
                  }} />
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div style={{
            margin: "40px 0",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
          }} />

          {/* Quick Categories */}
          <p style={{
            color: "#D4AF37",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            marginBottom: "20px",
            paddingLeft: "8px",
          }}>Categories</p>
          
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            paddingLeft: "8px",
          }}>
            {["Hommes", "Femmes", "T-Shirts", "Chemises"].map((cat) => (
              <LocalizedClientLink
                key={cat}
                href={`/categories/${cat.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "25px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "13px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  background: "rgba(255,255,255,0.02)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4AF37"
                  e.currentTarget.style.color = "#D4AF37"
                  e.currentTarget.style.background = "rgba(212,175,55,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)"
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)"
                }}
              >
                {cat}
              </LocalizedClientLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div style={{
          padding: "24px 32px",
          borderTop: "1px solid rgba(212,175,55,0.15)",
          flexShrink: 0,
          background: "rgba(0,0,0,0.3)",
        }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
            }}
            onMouseEnter={toggleState.open}
            onMouseLeave={toggleState.close}
          >
            {regions && (
              <CountrySelect
                toggleState={toggleState}
                regions={regions}
              />
            )}
            <ArrowRightMini
              className={clx(
                "transition-transform duration-300",
                toggleState.state ? "-rotate-90" : ""
              )}
              style={{ color: "rgba(255,255,255,0.5)" }}
            />
          </div>
          
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "11px",
            marginTop: "20px",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}>
             {new Date().getFullYear()} M&A Collections. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <button
          data-testid="nav-menu-button"
          onClick={() => setIsOpen(true)}
          className="group h-full flex items-center gap-3 px-3 py-2 rounded-full hover:bg-grey-10 transition-all duration-300 focus:outline-none"
        >
          {/* Animated hamburger icon */}
          <div className="flex flex-col gap-1.5 w-5">
            <span className={clx(
              "block h-[2px] rounded-full transition-all duration-300 origin-center",
              isOpen ? "bg-brand-gold rotate-45 translate-y-[5px]" : "bg-grey-60 group-hover:bg-brand-gold w-5"
            )} />
            <span className={clx(
              "block h-[2px] rounded-full transition-all duration-300",
              isOpen ? "bg-brand-gold opacity-0 scale-0" : "bg-grey-60 group-hover:bg-brand-gold w-3.5"
            )} />
            <span className={clx(
              "block h-[2px] rounded-full transition-all duration-300 origin-center",
              isOpen ? "bg-brand-gold -rotate-45 -translate-y-[5px]" : "bg-grey-60 group-hover:bg-brand-gold w-4"
            )} />
          </div>
          <span className="hidden small:block text-sm font-medium text-grey-60 group-hover:text-brand-gold transition-colors">
            Menu
          </span>
        </button>
      </div>

      {mounted && createPortal(menuContent, document.body)}
    </div>
  )
}

export default SideMenu
