"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

import { sanitizeData, API_URL } from "@/lib/api";

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

  // Helper function to generate slug from product data
  const generateSlug = (product: Product) => {
    // ... (rest of generateSlug logic is already there, but I need to make sure I don't duplicate or delete it incorrectly)
    // Actually, generateSlug was preserved in the file content I viewed in Step 697, lines 15+ seem to be fetchWishlist.
    // Wait, looking at Step 697, lines 15-40 is fetchWishlist.
    // Lines 42-61 is handleRemove.
    // Lines 63-65 is useEffect.
    // The generateSlug function seems to be MISSING in Step 697!
    // It was present in Step 683 (lines 26-57).
    // So I need to restore generateSlug as well.

    console.log('generateSlug called with product:', {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortcode: product.shortcode
    });

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

      // Debug: Log the first product to see what fields are available
      if (products.length > 0) {
        console.log("Wishlist product data:", products[0]);
      }

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
        // Update local state immediately for better UX
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        // Trigger header wishlist count refresh by dispatching a custom event
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {products.length === 0 && !loading && <div>No products in wishlist.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <Card key={product.id} className="p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
            <Link href={`/product/${generateSlug(product)}`} className="flex flex-col items-center w-full">
              <div className="relative w-32 h-32 mb-3">
                <Image
                  src={product.images?.[0]?.src || "/placeholder.svg"}
                  alt={product.images?.[0]?.alt || product.name}
                  fill
                  className="object-contain rounded"
                  sizes="128px"
                />
              </div>
              <div className="font-semibold text-lg mb-1 text-center">{product.name}</div>
              <div className="text-sm text-gray-500 mb-2">SKU: {product.shortcode}</div>
              <div className="text-xl font-bold text-[#009999] mb-4">₹{product.price?.toLocaleString()}</div>
            </Link>
            <div className="flex gap-2 w-full">
              <Button variant="destructive" onClick={() => handleRemove(product.id)} className="flex-1">
                Remove
              </Button>
              <Button variant="outline" onClick={() => window.location.href = `/product/${generateSlug(product)}`} className="flex-1">
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
