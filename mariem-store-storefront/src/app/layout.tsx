import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "M&A Collections | Premium Fashion Tunisia",
    template: "%s | M&A Collections",
  },
  description: "Découvrez l'élégance tunisienne. Des vêtements de qualité premium pour hommes et femmes. Livraison en Tunisie.",
  keywords: ["fashion", "clothing", "tunisia", "mode", "vêtements", "tunisie", "premium"],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
