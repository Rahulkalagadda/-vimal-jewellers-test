import type { StaticImageData } from "next/image"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string | StaticImageData
  metal: string
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const cartData = localStorage.getItem("candere_cart")
    return cartData ? JSON.parse(cartData) : []
  } catch (error) {
    console.error("Error parsing cart data from localStorage:", error)
    return []
  }
}
