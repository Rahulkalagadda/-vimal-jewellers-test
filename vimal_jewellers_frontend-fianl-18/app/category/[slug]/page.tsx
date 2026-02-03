"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const FilterSidebar = dynamic(() => import("@/components/FilterSidebar"), { ssr: false });
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { API_URL, fetchCategoryDetails } from "@/lib/api";
import { Heart } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  banner?: string;
}

interface ProductImage {
  alt: string;
  src: string;
}

interface Product {
  id: number;
  name: string;
  images: ProductImage[];
  description: string;
  price: number;
  mrp: number;
  slug: string;
  badgeTag?: string;
  rating?: number;
  reviews?: number;
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params === "object" && params !== null ? (params as any).slug : undefined;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Initialize Filter state from URL params or default to empty
  const [selectedPrices, setSelectedPrices] = useState<string[]>(searchParams.get('price')?.split(',') || []);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(searchParams.get('material')?.split(',') || []);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(searchParams.get('style')?.split(',') || []);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(searchParams.get('occasion')?.split(',') || []);

  // Update state when URL params change (e.g. navigation from mega menu)
  useEffect(() => {
    setSelectedPrices(searchParams.get('price')?.split(',').filter(Boolean) || []);
    setSelectedMaterials(searchParams.get('material')?.split(',').filter(Boolean) || []);
    setSelectedStyles(searchParams.get('style')?.split(',').filter(Boolean) || []);
    setSelectedOccasions(searchParams.get('occasion')?.split(',').filter(Boolean) || []);
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Build query params for filters
        // Build query params for filters
        const params = new URLSearchParams();
        if (selectedPrices.length > 0) params.append('price', selectedPrices.join(','));
        if (selectedMaterials.length > 0) params.append('material', selectedMaterials.join(','));
        if (selectedStyles.length > 0) params.append('style', selectedStyles.join(','));
        if (selectedOccasions.length > 0) params.append('occasion', selectedOccasions.join(','));

        const data = await fetchCategoryDetails(slug, params);
        setCategory(data.category);
        setProducts(data.products);
      } catch (err) {
        setCategory(null);
        setProducts([]);
      }
      setLoading(false);
    }
    if (slug) fetchData();
  }, [slug, selectedPrices, selectedMaterials, selectedStyles, selectedOccasions]);

  const toggleWishlist = async (productId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      alert("Please login to add items to wishlist");
      return;
    }

    try {
      const isInWishlist = wishlist.includes(productId);

      if (isInWishlist) {
        // Remove from wishlist
        await fetch(`${API_URL}/wishlist/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        // Add to wishlist
        await fetch(`${API_URL}/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: parseInt(productId) }),
        });
        setWishlist((prev) => [...prev, productId]);
      }
      // Trigger header wishlist count refresh
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!category) {
    return <div className="text-center py-10">Category not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Banner */}
      {category.banner && (
        <div className="w-full h-48 relative">
          <Image src={category.banner} alt={category.name + ' Banner'} fill className="object-cover" />
        </div>
      )}
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
            <span>Home</span> <span className="mx-1">/</span> <span>Jewellery</span> <span className="mx-1">/</span> <span className="text-gray-800 font-medium">{category.name}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-900 capitalize mb-4">
            {category.name} <span className="text-base font-normal text-gray-500 font-sans ml-2">({products.length} Designs)</span>
          </h1>

          {/* Horizontal Filter Tabs (Quick Filters) */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button className="px-5 py-2 rounded-full border border-gray-900 bg-gray-900 text-white text-sm font-medium transition-colors hover:bg-gray-800">
              All
            </button>
            <button className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors bg-white">
              In Stock
            </button>
            <button className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors bg-white">
              Fast Delivery
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar
            filters={
              <div className="bg-white rounded-lg pt-2">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Filters</h2>
                  <span className="text-xs text-[#009999] cursor-pointer font-semibold uppercase hover:underline">Clear All</span>
                </div>

                {/* Re-using existing structure but with improved spacing classes if manageable here, 
                       otherwise relying on global styles or passed classes */}

                {/* Filter: Price Range */}
                <div className="mb-8">
                  <div className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Price</div>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#009999] checked:border-[#009999] appearance-none transition-colors" value="under-5000" checked={selectedPrices.includes('under-5000')} onChange={e => {
                          const checked = e.target.checked;
                          setSelectedPrices(prev => checked ? [...prev, 'under-5000'] : prev.filter(v => v !== 'under-5000'));
                        }} />
                        <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">Under ₹5,000</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#009999] checked:border-[#009999] appearance-none transition-colors" value="5000-10000" checked={selectedPrices.includes('5000-10000')} onChange={e => {
                          const checked = e.target.checked;
                          setSelectedPrices(prev => checked ? [...prev, '5000-10000'] : prev.filter(v => v !== '5000-10000'));
                        }} />
                        <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">₹5,000 - ₹10,000</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#009999] checked:border-[#009999] appearance-none transition-colors" value="10000-20000" checked={selectedPrices.includes('10000-20000')} onChange={e => {
                          const checked = e.target.checked;
                          setSelectedPrices(prev => checked ? [...prev, '10000-20000'] : prev.filter(v => v !== '10000-20000'));
                        }} />
                        <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">₹10,000 - ₹20,000</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#009999] checked:border-[#009999] appearance-none transition-colors" value="above-20000" checked={selectedPrices.includes('above-20000')} onChange={e => {
                          const checked = e.target.checked;
                          setSelectedPrices(prev => checked ? [...prev, 'above-20000'] : prev.filter(v => v !== 'above-20000'));
                        }} />
                        <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">Above ₹20,000</span>
                    </label>
                  </div>
                </div>
                {/* Filter: Material */}
                <div className="mb-8">
                  <div className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Material</div>
                  <div className="flex flex-col gap-3">
                    {['gold', 'silver', 'diamond'].map(m => (
                      <label key={m} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#009999] checked:border-[#009999] appearance-none transition-colors" value={m} checked={selectedMaterials.includes(m)} onChange={e => {
                            const checked = e.target.checked;
                            setSelectedMaterials(prev => checked ? [...prev, m] : prev.filter(v => v !== m));
                          }} />
                          <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter: Style */}
                <div className="mb-8">
                  <div className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Style</div>
                  <div className="flex flex-col gap-3">
                    {['traditional', 'modern', 'casual'].map(s => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#009999] checked:border-[#009999] appearance-none transition-colors" value={s} checked={selectedStyles.includes(s)} onChange={e => {
                            const checked = e.target.checked;
                            setSelectedStyles(prev => checked ? [...prev, s] : prev.filter(v => v !== s));
                          }} />
                          <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter: Occasion */}
                <div className="mb-6">
                  <div className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Occasion</div>
                  <div className="flex flex-col gap-3">
                    {['party-wear', 'wedding', 'daily-wear', 'office-wear'].map(o => (
                      <label key={o} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#009999] checked:border-[#009999] appearance-none transition-colors" value={o} checked={selectedOccasions.includes(o)} onChange={e => {
                            const checked = e.target.checked;
                            setSelectedOccasions(prev => checked ? [...prev, o] : prev.filter(v => v !== o));
                          }} />
                          <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">{o.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
        </aside>

        {/* Right Content - Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{products.length}</span> Results
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Sort By:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:border-[#009999] hover:border-gray-300 text-sm cursor-pointer shadow-sm">
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">No products found for this category.</div>
            ) : (
              <>
                {products.map((product) => {
                  // Placeholder values for badge, discount, rating, and reviews
                  const badge = product.badgeTag || "BESTSELLER"; // Use product.badgeTag if available
                  const badgeColor = badge === "TRENDING" ? "bg-pink-500" : "bg-purple-600";
                  const discount = product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
                  const rating = product.rating || 4.9; // Use product.rating if available
                  const reviews = product.reviews || 50; // Use product.reviews if available
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group border border-gray-100 flex flex-col"
                    >
                      {/* Badge */}
                      <div className={`absolute top-0 left-0 px-4 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-br-lg z-10 ${badgeColor}`}>
                        {badge}
                      </div>

                      {/* Wishlist Button */}
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.id.toString());
                          }}
                        >
                          <Heart className={`w-5 h-5 ${wishlist.includes(product.id.toString()) ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
                        </button>
                      </div>

                      {/* Product Image Container */}
                      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                        <Image
                          src={product.images?.[0]?.src || "/placeholder.jpg"}
                          alt={product.images?.[0]?.alt || product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-grow">
                        {/* Pricing Row */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xl font-bold text-[#009999]">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-sm text-gray-400 line-through decoration-gray-400">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="text-xs font-semibold text-green-600 ml-1">
                              {discount}% Off
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 leading-relaxed min-h-[2.5em]">
                          {product.name}
                        </h3>

                        {/* Rating Row */}
                        <div className="flex items-center gap-1 mt-auto pt-2">
                          <div className="flex items-center bg-gray-100 px-1.5 py-0.5 rounded text-xs font-bold text-gray-700">
                            <span className="text-yellow-500 mr-1">★</span>
                            {rating}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({reviews})
                          </span>
                        </div>

                        {/* Description Preview (Optional/Hidden on smaller cards usually) */}
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                          {product.description?.replace(/<[^>]*>/g, '').substring(0, 60)}...
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
