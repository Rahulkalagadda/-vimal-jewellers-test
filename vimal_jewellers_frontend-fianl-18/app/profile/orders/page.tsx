"use client"
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
        // const API_URL = ... imported from lib
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

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-2">MY ORDERS</h1>
      <p className="text-gray-600 mb-8">View and manage all your precious jewelry orders from Candere</p>

      {/* Order Lookup */}
      <section className="bg-white rounded-xl shadow p-6 mb-10 border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">ORDER LOOKUP</h2>
        <p className="text-gray-600 mb-4">Enter your order number to view detailed tracking information</p>
        <form className="flex flex-col sm:flex-row gap-2 max-w-md">
          <input type="text" placeholder="Enter order number (e.g., KJ2024001)" className="flex-1 border rounded px-3 py-2" />
          <Button type="submit" className="bg-[#6bbba1] text-white px-6">TRACK</Button>
        </form>
      </section>

      {/* Recent Orders */}
      <h2 className="text-xl font-semibold mb-4">YOUR RECENT ORDERS</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
          You have no past orders.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">ORDER #{order.id}</div>
                    <div className="text-gray-500 text-sm">Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>

                <div className="mb-2 font-medium text-sm text-gray-700">ITEMS ({order.items.length})</div>
                <div className="flex gap-4 flex-wrap">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 flex flex-col items-center w-32 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mb-2 mix-blend-multiply" />
                      <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 h-8">{item.name}</div>
                      <div className="text-[10px] text-gray-500 mt-1">Qty: {item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4 min-w-[200px] items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div className="flex gap-2 items-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">DELIVERED</span>
                  <Link href={`/orders/track?orderId=${order.id}`}>
                    <Button variant="outline" className="border-[#009999] text-[#009999] px-3 py-1 text-xs hover:bg-[#e0f2f2]">Track Order</Button>
                  </Link>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">TOTAL AMOUNT</div>
                  <div className="text-xl font-bold text-green-700">{order.total}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
