"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckoutProgress } from "@/components/checkout-progress"
import { ArrowLeft, CreditCard, Wallet, Banknote } from "lucide-react";
import { API_URL } from "@/lib/api";
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"

export default function CheckoutPaymentPage() {
  const router = useRouter()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/checkout") // Redirect to cart if empty
    }
  }, [router, cartItems])

  const handlePayment = async (method: string) => {
    // Get address from localStorage
    const address = typeof window !== "undefined" ? localStorage.getItem("shippingAddress") : "";
    if (!address || cartItems.length === 0) {
      alert("Missing address or cart items.");
      return;
    }
    // Get token
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      alert("You must be logged in to place an order. Please sign in.");
      router.push("/auth/sign-in");
      return;
    }
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Prepare order payload
    const orderPayload = {
      items: cartItems,
      total,
      status: "Processing",
      address,
      paymentMethod: method
    };
    try {
      // const API_URL = ... imported
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) throw new Error("Order creation failed");
      const order = await res.json();
      // Optionally clear cart and address
      localStorage.removeItem("shippingAddress");
      // Redirect to confirmation page with order id
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (err) {
      alert("Order failed. Please try again.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <div className="bg-[#009999] text-white py-3 text-center text-lg font-semibold">
        Carry your Shine Everywhere You Go CHECKOUT NOW!
      </div>
      <CheckoutProgress currentStep="payment" />

      <div className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Payment Method</h2>
        <div className="grid grid-cols-1 gap-4">
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-4 rounded-md text-lg font-semibold"
            onClick={() => handlePayment("UPI")}
          >
            Pay with UPI
          </Button>
          <Button
            className="w-full bg-purple-600 text-white hover:bg-purple-700 py-4 rounded-md text-lg font-semibold"
            onClick={() => handlePayment("Card")}
          >
            Pay with Card
          </Button>
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700 py-4 rounded-md text-lg font-semibold"
            onClick={() => handlePayment("Cash on Delivery")}
          >
            Cash on Delivery (COD)
          </Button>
        </div>
      </div>
    </div>
  )
}
