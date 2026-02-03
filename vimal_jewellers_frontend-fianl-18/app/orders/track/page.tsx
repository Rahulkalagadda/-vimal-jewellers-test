"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/api";
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutProgress } from "@/components/checkout-progress" // Reusing for consistent header
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function OrderTrackingPage() {
  useAuthGuard();
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get("orderId") || ""
  const [orderId, setOrderId] = useState(initialOrderId)
  const [trackingInfo, setTrackingInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)


  const handleTrackOrder = () => {
    setError(null);
    setTrackingInfo(null);
    if (!orderId) {
      setError("Please enter an Order ID.");
      return;
    }
    // Get token
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then((data) => {
        setTrackingInfo(data);
      })
      .catch(() => {
        setError("Order not found. Please check the Order ID.");
      });
  }

  useEffect(() => {
    if (initialOrderId) {
      handleTrackOrder()
    }
  }, [initialOrderId]) // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "Shipped":
        return <Truck className="w-6 h-6 text-blue-500" />
      case "Processing":
        return <Package className="w-6 h-6 text-yellow-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-[#009999] text-white py-3 text-center text-lg font-semibold">Track Your Order</div>
      <div className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full">
        <div className="space-y-4 mb-8">
          <div>
            <Label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">Enter Order ID</Label>
            <Input
              id="orderId"
              type="text"
              placeholder="e.g., ORD123456789"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            className="w-full bg-[#009999] text-white hover:bg-[#007a7a] py-3 rounded-md font-semibold"
            onClick={handleTrackOrder}
          >TRACK ORDER</Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {trackingInfo && (
          <div className="space-y-8">
            {/* Order Items Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="flex flex-col gap-4">
                {Array.isArray(trackingInfo.products) && trackingInfo.products.length > 0 ? (
                  trackingInfo.products.map((item: any, idx: number) => (
                    <div key={idx} className="bg-[#fcfaf6] rounded-lg flex flex-col sm:flex-row items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <img src={item.image?.src || "/placeholder.svg"} alt={item.image?.alt || item.name || "Product"} width={64} height={64} className="object-contain rounded-md" />
                        <div>
                          <div className="font-semibold text-lg">{item.name || "Product Name"}</div>
                          <div className="text-sm text-gray-500">SKU: {item.sku || "N/A"}</div>
                          <div className="text-sm text-gray-500">Qty: {item.qty || 1}</div>
                        </div>
                      </div>
                      <div className="text-xl font-semibold text-yellow-600">₹{item.price?.toLocaleString() || "0"}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No products found for this order.</div>
                )}
              </div>
            </div>

            {/* Order Timeline Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
              <div className="flex flex-col gap-4">
                {Array.isArray(trackingInfo?.history) && trackingInfo.history.length > 0 ? (
                  trackingInfo.history.map((event: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-gray-500 text-sm">{event.date} {event.time}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{event.description}</div>
                      </div>
                      <div>
                        {getStatusIcon(trackingInfo.status)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No timeline events available.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
