"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckoutProgress } from "@/components/checkout-progress"
import { useDispatch } from "react-redux"
import { clearCart } from "@/lib/features/cart/cartSlice"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [shippingAddress, setShippingAddress] = useState("")
  const [orderedItems, setOrderedItems] = useState<any[]>([])

  useEffect(() => {
    const storedAddress = localStorage.getItem("shippingAddress")
    if (storedAddress) {
      setShippingAddress(storedAddress)
    }
    // Read cart before clearing
    const cart = localStorage.getItem("candere_cart")
    if (cart) {
      setOrderedItems(JSON.parse(cart))
    }
    dispatch(clearCart()) // Clear cart after successful order
  }, [dispatch]) // Add dispatch to dependency array

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <div className="bg-[#009999] text-white py-3 text-center text-lg font-semibold">
        Carry your Shine Everywhere You Go CHECKOUT NOW!
      </div>
      <CheckoutProgress currentStep="success" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Thank You for Your Order!</h2>
        <p className="text-lg text-gray-700 mb-6">Your order has been placed successfully.</p>

        {shippingAddress && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm max-w-md w-full mb-8">
            <h3 className="text-xl font-semibold mb-3">Shipping Address:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{shippingAddress}</p>
          </div>
        )}

        {orderedItems.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm max-w-md w-full mb-8">
            <h3 className="text-xl font-semibold mb-3">Order Summary:</h3>
            {orderedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <Image src={item.image} alt={item.name} width={60} height={60} className="object-contain rounded-md" />
                <div className="flex-1 text-left">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">Metal: {item.metal}</div>
                  {item.ringSize && (
                    <div className="text-sm text-gray-600">Ring Size: {item.ringSize}</div>
                  )}
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  <div className="text-sm text-[#009999] font-bold">₹{item.price.toLocaleString("en-IN")}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          className="bg-[#009999] text-white hover:bg-[#007a7a] px-8 py-3 rounded-md font-semibold"
          onClick={() => router.push("/")}
        >
          BACK TO HOME
        </Button>
      </div>
    </div>
  )
}
