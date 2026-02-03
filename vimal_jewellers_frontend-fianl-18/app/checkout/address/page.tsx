"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckoutProgress } from "@/components/checkout-progress"
import { getCartItems } from "@/lib/cart-utils"

export default function CheckoutAddressPage() {
  const router = useRouter()
  const [address, setAddress] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    const storedAddress = localStorage.getItem("shippingAddress")
    if (storedAddress) {
      setAddress(storedAddress)
    }
    setCartItems(getCartItems())
  }, [])

  const handleProceedToPayment = () => {
    if (address.trim() === "") {
      alert("Please enter your shipping address.")
      return
    }
    localStorage.setItem("shippingAddress", address)
    router.push("/checkout/payment")
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        <CheckoutProgress currentStep="address" />
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="text-center text-gray-600">Your cart is empty. Please add items to proceed to checkout.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <div className="bg-[#009999] text-white py-3 text-center text-lg font-semibold">
        Carry your Shine Everywhere You Go CHECKOUT NOW!
      </div>
      <CheckoutProgress currentStep="address" />

      <div className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Shipping Address</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input id="fullName" type="text" placeholder="Enter your full name" className="w-full" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" className="w-full" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Full Shipping Address
            </label>
            <Textarea
              id="address"
              placeholder="House No., Street, Locality, City, State, Pincode"
              rows={5}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
              Landmark (Optional)
            </label>
            <Input id="landmark" type="text" placeholder="e.g., Near XYZ Bank" className="w-full" />
          </div>
        </div>
        <Button
          className="w-full bg-[#009999] text-white hover:bg-[#007a7a] py-3 rounded-md font-semibold mt-8"
          onClick={handleProceedToPayment}
        >
          PROCEED TO PAYMENT
        </Button>
      </div>
    </div>
  )
}
