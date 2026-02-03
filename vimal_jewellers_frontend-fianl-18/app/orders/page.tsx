"use client"
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react'

export default function MyOrdersPage() {
  useAuthGuard();
  type OrderItem = { name: string; quantity: number; image: string };
  type Order = {
    id: string;
    date: string;
    total: string;
    status: string;
    items: OrderItem[];
  };
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        // const API_URL = ... imported
        const res = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError("Could not load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 px-4 md:px-0 max-w-3xl mx-auto w-full py-10">
        <h1 className="text-4xl font-bold text-center mb-2">MY ORDERS</h1>
        <p className="text-center text-gray-600 mb-8">View and manage all your precious jewelry orders from Candere</p>

        {/* Order Lookup */}
        <section className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-lg font-semibold mb-2">ORDER LOOKUP</h2>
          <p className="text-gray-600 mb-4">Enter your order number to view detailed tracking information</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md">
            <input type="text" placeholder="Enter order number (e.g., KJ2024001)" className="flex-1 border rounded px-3 py-2" />
            <Button type="submit" className="bg-[#6bbba1] text-white px-6">TRACK</Button>
          </form>
        </section>

        {/* Recent Orders */}
        <h2 className="text-2xl font-semibold mb-4">YOUR RECENT ORDERS</h2>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600 py-10">You have no past orders.</div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="mb-2 text-lg font-semibold">ORDER #{order.id}</div>
                  <div className="text-gray-500 text-sm mb-4">Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  <div className="mb-2 font-semibold">ITEMS ({order.items.length})</div>
                  <div className="flex gap-4 flex-wrap">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-2 flex flex-col items-center w-full sm:w-40">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mb-2 rounded" />
                        <div className="text-sm font-medium text-gray-800 text-center">{item.name}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                        <div className="text-xs text-gray-500">SKU: DSR-001</div>
                        <div className="text-sm text-green-700 font-semibold mt-1">₹85,000</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4 min-w-[200px] items-end justify-between">
                  <div className="flex gap-2 items-center">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">DELIVERED</span>
                    <Link href={`/orders/track?orderId=${order.id}`}>
                      <Button variant="outline" className="border-[#009999] text-[#009999] px-3 py-1 text-xs hover:bg-[#e0f2f2]">Track Order</Button>
                    </Link>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">TOTAL AMOUNT</div>
                    <div className="text-2xl font-bold text-green-700">{order.total}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">DELIVERED ON</div>
                    <div className="text-sm font-semibold">22 Jan 2024</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600 mt-auto">
        © 2025 Vimal Jewels. All rights reserved.
      </footer>
    </div>
  )
}
