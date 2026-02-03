"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCartTotal } from "@/lib/cart-utils";
import { CheckoutProgress } from "@/components/checkout-progress";
import { X, Truck, CheckCircle, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { removeFromCart } from "@/lib/features/cart/cartSlice";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const subtotal = getCartTotal(cartItems);
  const discount = 1089;
  const total = subtotal - discount;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <div className="bg-[#009999] text-white py-3 text-center text-lg font-semibold">
        Carry your Shine Everywhere You Go CHECKOUT NOW!
      </div>
      <CheckoutProgress currentStep="bag" />

      <div className="flex flex-col lg:flex-row flex-1 p-4 md:p-8 gap-8">
        {/* Left Section - Cart Items */}
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">TOTAL ITEM {cartItems.length}</h2>
          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-gray-600">Your cart is empty.</div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-contain rounded-md"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">Metal: {item.metal}</p>
                  {item.ringSize && (
                    <p className="text-sm text-gray-600">Ring Size: {item.ringSize}</p>
                  )}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                  <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-gray-700 mb-2">
                    <X className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-[#009999]">₹{item.price.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{(item.price + 1000).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))
          )}
          <Link href="/" className="text-[#009999] hover:underline mt-6 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> CONTINUE SHOPPING
          </Link>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-md">
          <Button className="w-full bg-[#009999] text-white hover:bg-[#007a7a] py-3 rounded-md font-semibold mb-6">
            CHECKOUT SECURELY
          </Button>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Apply Offer / Voucher</span>
              <Button variant="link" className="text-[#009999] p-0 h-auto">
                CHECK OFFERS
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Coupon MONSOON Applied Successfully</span>
              </div>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-green-700 hover:bg-green-100">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-4">ORDER SUMMARY</h3>
          <div className="space-y-2 text-gray-700 mb-6">
            <div className="flex justify-between">
              <span>Item total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount (MONSOON)</span>
              <span className="text-green-600">-₹{discount.toLocaleString("en-IN")}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-xl font-bold text-[#009999]">
              <span>Order Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Your total savings</span>
              <span>₹{discount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <Button
            className="w-full bg-[#009999] text-white hover:bg-[#007a7a] py-3 rounded-md font-semibold"
            onClick={() => router.push("/checkout/address")}
            disabled={cartItems.length === 0}
          >
            PROCEED TO ADDRESS
          </Button>
        </div>
      </div>
    </div>
  );
}
