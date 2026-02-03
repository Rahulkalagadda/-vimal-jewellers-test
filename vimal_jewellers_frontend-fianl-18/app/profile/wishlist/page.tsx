"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { sanitizeData } from "@/lib/api";

export default function WishlistPage() {
  useAuthGuard();
  type Product = {
    id: number;
    name: string;
    images?: { src: string; alt?: string }[];
    shortcode?: string;
    price?: number;
    slug?: string;
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (product: Product) => {
    if (product.slug && typeof product.slug === 'string' && !product.slug.match(/^\d+$/)) {
      return product.slug;
    }
    if (product.shortcode && typeof product.shortcode === 'string' && !product.shortcode.match(/^\d+$/)) {
      return product.shortcode;
    }
    const generatedSlug = product.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return generatedSlug;
  };

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const rawData = await res.json();
      const data = sanitizeData(rawData);
      const products = data.products || [];
      setProducts(products);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      } else {
        setError("Failed to remove item from wishlist");
      }
    } catch (err) {
      setError("Failed to remove item from wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {products.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Button variant="outline" onClick={() => window.location.href = '/category/all-jewellery'}>Browse Jewellery</Button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <Card key={product.id} className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <Link href={`/product/${generateSlug(product)}`} className="block">
              <div className="relative w-full aspect-square bg-gray-50 p-4">
                <Image
                  src={product.images?.[0]?.src || "/placeholder.svg"}
                  alt={product.images?.[0]?.alt || product.name}
                  fill
                  className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#009999] transition-colors">{product.name}</div>
                <div className="text-xs text-gray-500 mb-2">SKU: {product.shortcode}</div>
                <div className="text-lg font-bold text-[#009999]">₹{product.price?.toLocaleString()}</div>
              </div>
            </Link>
            <div className="px-4 pb-4 flex gap-2">
              <Button
                variant="outline"
                onClick={(e) => { e.stopPropagation(); handleRemove(product.id); }}
                className="flex-1 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 h-9 text-xs"
              >
                Remove
              </Button>
              <Button
                variant="default"
                onClick={(e) => { e.stopPropagation(); window.location.href = `/product/${generateSlug(product)}`; }}
                className="flex-1 bg-[#009999] hover:bg-[#007a7a] text-white h-9 text-xs"
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
