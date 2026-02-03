import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { StaticImageData } from "next/image"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string | StaticImageData
  metal: string // Example: "14K Yellow Gold (1.51g)"
  ringSize?: number | string // Optional: selected ring size
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("candere_cart") || "[]") : [],
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
        existingItem.price = action.payload.price // Update price to latest
      } else {
        state.items.push(action.payload)
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("candere_cart", JSON.stringify(state.items))
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      if (typeof window !== "undefined") {
        localStorage.setItem("candere_cart", JSON.stringify(state.items))
      }
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const itemToUpdate = state.items.find((item) => item.id === action.payload.id)
      if (itemToUpdate) {
        itemToUpdate.quantity = action.payload.quantity
        if (itemToUpdate.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== action.payload.id)
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("candere_cart", JSON.stringify(state.items))
        }
      }
    },
    clearCart: (state) => {
      state.items = []
      if (typeof window !== "undefined") {
        localStorage.removeItem("candere_cart")
      }
    },
  },
})

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer
