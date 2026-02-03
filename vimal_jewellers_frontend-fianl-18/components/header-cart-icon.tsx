
import React from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"

export function HeaderCartIcon() {
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <Button variant="ghost" size="icon" className="rounded-full relative">
      <Link href="/checkout">
        <ShoppingCart className="w-5 h-5 text-gray-700" />
        {mounted && cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  )
}
