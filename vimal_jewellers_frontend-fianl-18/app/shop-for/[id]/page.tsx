"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import { fetchCategoryDetails, fetchShopForDetails } from "@/lib/api";

interface Product {
    id: number;
    name: string;
    images: any[];
    description: string;
    price: number;
    mrp: number;
    slug: string;
    badgeTag?: string;
    rating?: number;
    reviews?: number;
}

export default function ShopForPage() {
    const params = useParams();
    const id = typeof params === "object" && params !== null ? (params as any).id : undefined;
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [shopForData, setShopForData] = useState<any>(null);
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            setLoading(true);
            try {
                // 1. Fetch Shop For Details
                const shopFor = await fetchShopForDetails(id);
                setShopForData(shopFor);

                if (shopFor && shopFor.shopForMegaCategory) {
                    // 2. Fetch Products for this Mega Category + Price Range
                    // We assume Mega Category Name maps to Category Slug (e.g. "RINGS" -> "rings")
                    const categorySlug = shopFor.shopForMegaCategory.name.toLowerCase().replace(/ /g, '-');

                    const queryParams = new URLSearchParams();
                    if (shopFor.startPrice) queryParams.append('minPrice', shopFor.startPrice);
                    if (shopFor.endPrice) queryParams.append('maxPrice', shopFor.endPrice);

                    const categoryData = await fetchCategoryDetails(categorySlug, queryParams);
                    setProducts(categoryData.products);
                }
            } catch (err) {
                console.error("Error fetching shop for data:", err);
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    const toggleWishlist = async (productId: string) => {
        // ... (Reuse wishlist logic or extract to hook)
        // For brevity, just alerting if not implemented fully
        alert("Wishlist functionality requires auth context");
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!shopForData) return <div className="text-center py-20">Item not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Shop For: {shopForData.shopForMegaCategory?.name || 'Jewellery'}
                </h1>
                <p className="text-gray-600">
                    Price Range:
                    {shopForData.startPrice && shopForData.endPrice ? ` ₹${shopForData.startPrice} - ₹${shopForData.endPrice}` :
                        shopForData.startPrice ? ` Above ₹${shopForData.startPrice}` :
                            shopForData.endPrice ? ` Under ₹${shopForData.endPrice}` : ''}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No products found in this price range.
                    </div>
                ) : (
                    products.map((product) => {
                        const badge = product.badgeTag || "BESTSELLER";
                        const badgeColor = badge === "TRENDING" ? "bg-pink-500" : "bg-purple-600";
                        const discount = product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden relative group hover:shadow-xl transition-shadow"
                            >
                                <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-bold text-white rounded-br-lg ${badgeColor}`}>
                                    {badge}
                                </div>
                                <div className="w-full h-60 p-4 relative">
                                    <Image
                                        src={product.images?.[0]?.src || "/placeholder.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="text-xl font-bold text-[#009999]">₹{product.price.toLocaleString()}</div>
                                        {product.mrp > product.price && (
                                            <div className="text-sm text-gray-500 line-through">₹{product.mrp?.toLocaleString()}</div>
                                        )}
                                    </div>
                                    {discount > 0 && <div className="text-green-600 text-sm font-semibold mb-1">{discount}% Off</div>}
                                    <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
