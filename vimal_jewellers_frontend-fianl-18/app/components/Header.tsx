"use client";
import { HeaderCartIcon } from "@/components/header-cart-icon";
import { Button } from "@/components/ui/button";
import { AnimatedSearchInput } from "@/components/AnimatedSearchInput";
import { UserDropdown } from "@/components/user-dropdown";
import { ChevronDown, FileText, Headset, Heart, Menu, Search, ShoppingCart, Truck } from 'lucide-react';
import { API_URL, fetchMegaMenu } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [megaMenuData, setMegaMenuData] = useState<any>({});
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  const [categories, setCategories] = useState<string[]>([
    "BESTSELLERS",
    "NEW ARRIVALS",
  ]);

  // Fallback mega menu data


  // Fetch mega menu data
  useEffect(() => {
    const loadMegaMenu = async () => {
      setIsLoadingMenu(true);
      try {
        const data = await fetchMegaMenu();

        if (Array.isArray(data) && data.length > 0) {
          // Transform backend array to frontend object structure
          const transformedData: any = {};
          const dynamicCategories: string[] = [];

          data.forEach((cat: any) => {
            if (!cat.name) return;
            // Skip if it's one of the static categories we already added
            if (["BESTSELLERS", "NEW ARRIVALS"].includes(cat.name)) return;

            dynamicCategories.push(cat.name);
            transformedData[cat.name] = {
              shopByStyle: (cat.styles || []).filter((s: any) => s && s.name),
              shopByMaterial: (cat.materials || []).filter((m: any) => m && m.name),
              shopFor: (cat.shopFors || []).filter((s: any) => s && (s.startPrice || s.endPrice || s.name)),
              shopByOccasion: (cat.occassions || []).filter((o: any) => o && o.name),
            };
          });
          setMegaMenuData(transformedData);

          // Update categories list, keeping static ones first
          setCategories([
            "BESTSELLERS",
            "NEW ARRIVALS",
            ...dynamicCategories
          ]);
        } else {
          // Use fallback data if API fails or returns empty
          console.warn("Mega menu API returned empty or invalid data.");
          setMegaMenuData({});
        }
      } catch (error) {
        console.error("Error loading mega menu:", error);
        setMegaMenuData({});
      } finally {
        setIsLoadingMenu(false);
      }
    };

    loadMegaMenu();
  }, []);

  const renderMegaMenu = (category: string) => {
    const menuData = megaMenuData[category as keyof typeof megaMenuData];
    if (!menuData) return null;

    return (
      <div className="sticky top-[136px] md:top-[152px] left-0 w-full bg-white shadow-2xl border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-5 gap-8">
            {/* Shop by Style */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#FADDA0]">
                SHOP BY STYLE
              </h3>
              <div className="space-y-3">
                {menuData.shopByStyle.map((item: any) => (
                  item.name && (
                    <Link
                      key={item.name}
                      href={`/category/${category.trim().toLowerCase().replace(/ /g, '-')}?style=${item.name.trim().toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 text-sm"
                    >
                      {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/')) ? (
                        <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-lg">{item.icon}</span>
                      )}
                      <span>{item.name}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Shop by Material */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#FADDA0]">
                SHOP BY MATERIAL
              </h3>
              <div className="space-y-3">
                {menuData.shopByMaterial.map((item: any) => (
                  item.name && (
                    <Link
                      key={item.name}
                      href={`/category/${category.trim().toLowerCase().replace(/ /g, '-')}?material=${item.name.trim().toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 text-sm"
                    >
                      {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/')) ? (
                        <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-lg">{item.icon}</span>
                      )}
                      <span>{item.name}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Shop For */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#FADDA0]">
                SHOP FOR
              </h3>
              <div className="space-y-3">
                {menuData.shopFor.map((item: any, index: number) => (
                  <Link
                    key={index}
                    href={`/shop-for/${typeof item === 'object' && item.id ? item.id : item.trim().toLowerCase().replace(/[₹\s-]/g, '')}`}
                    className="block text-gray-600 hover:text-[#B8860B] transition-colors duration-200 text-sm py-1"
                  >
                    {typeof item === 'object'
                      ? item.startPrice && item.endPrice
                        ? `₹${item.startPrice} - ₹${item.endPrice}`
                        : item.startPrice
                          ? `Above ₹${item.startPrice}`
                          : item.endPrice
                            ? `Under ₹${item.endPrice}`
                            : item.name
                      : item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop by Occasion */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#FADDA0]">
                SHOP BY OCCASION
              </h3>
              <div className="space-y-3">
                {menuData.shopByOccasion.map((item: any) => (
                  item.name && (
                    <Link
                      key={item.name}
                      href={`/category/${category.trim().toLowerCase().replace(/ /g, '-')}?occasion=${item.name.trim().toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 text-sm"
                    >
                      {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/')) ? (
                        <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-lg">{item.icon}</span>
                      )}
                      <span>{item.name}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Featured Product */}
            <div className="bg-[#00C1A2] rounded-lg p-6 text-white flex flex-col items-center text-center h-full">
              <div className="bg-white p-4 rounded-xl mb-6 shadow-sm w-40 h-40 flex items-center justify-center">
                <Image
                  src="https://www.candere.com/media/jewellery/images/C022008_1.jpg"
                  alt={`Featured ${category}`}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium mb-6 leading-relaxed max-w-[200px]">
                Subtle and glamorous {category.toLowerCase()} to complete your outfit!
              </p>
              <Link
                href={`/category/${category.trim().toLowerCase()}/all`}
                className="text-xs font-bold underline hover:no-underline tracking-wider uppercase"
              >
                VIEW ALL DESIGNS
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setMounted(true);
    const fetchWishlistCount = async () => {
      const token = localStorage.getItem("token");
      try {
        // const API_URL = ... imported
        const res = await fetch(`${API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setWishlistCount(data.products.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist count", error);
      }
    };

    fetchWishlistCount();

    // Listen for wishlist updates from other components
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  return (
    <div className="relative w-full">


      {/* Main Navigation (Sticky) */}
      <nav className="bg-black py-4 px-4 md:px-8 border-b border-gray-800 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex-1 flex items-center gap-6">
          <div className="hidden md:block w-96">
            <AnimatedSearchInput suggestions={["Search for Rings", "Search for Earrings", "Search for Necklaces", "Search for Bracelets", "Search for Mangalsutra"]} />
          </div>
        </div>
        <Link href="/" className="flex flex-col items-center flex-shrink-0 cursor-pointer">
          <Image src="/logo.png" alt="Vimal Jewellers Logo" width={60} height={60} className="object-cover h-auto mx-auto" priority style={{ width: "auto", height: "auto" }} />
          <span className="block text-xs mt-1 font-normal text-[#3ed6e0] tracking-widest" style={{ letterSpacing: '0.2em' }}>VIMAL JEWELLERS</span>
          <span className="block text-[10px] font-light text-white tracking-widest" style={{ letterSpacing: '0.15em' }}>LIFESTYLE JEWELLERY</span>
        </Link>
        <div className="flex-1 flex items-center justify-end gap-4">
          <UserDropdown />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              onClick={() => window.location.href = '/wishlist'}
            >
              <Heart className="w-5 h-5 text-[#FADDA0]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount}
              </span>
              <span className="sr-only">Wishlist</span>
            </Button>
          )}
          <HeaderCartIcon />
        </div>
      </nav>

      {/* Category Navigation with Mega Menu (Sticky) */}
      {/* Hidden on mobile to avoid duplicate navigation and potential overflow; use mobile menu below instead */}
      <div className="hidden md:block bg-black py-3 px-4 md:px-8 border-b border-gray-800 sticky md:top-[72px] lg:top-[80px] z-30 overflow-hidden">
        <div className="max-w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-start min-w-max px-2">
            {categories.map((item) => (
              <div key={item} className="relative flex-shrink-0" onMouseEnter={() => setHoveredCategory(item)} onMouseLeave={() => setHoveredCategory(null)}>
                <Link href={`/category/${item.trim().toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className={`px-3 py-1 text-xs font-medium block whitespace-nowrap ${item === "NEW ARRIVALS" ? "text-[#FADDA0]" : "text-white hover:text-gray-300"}`}>{item}</Link>
              </div>
            ))}

          </div>
        </div>
        {/* Mega Menu */}
        {hoveredCategory && (
          <div onMouseEnter={() => setHoveredCategory(hoveredCategory)} onMouseLeave={() => setHoveredCategory(null)}>{renderMegaMenu(hoveredCategory)}</div>
        )}
      </div>

      {/* Mobile Menu Toggle and Responsive Categories */}
      <div className="md:hidden bg-black py-4 px-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <AnimatedSearchInput suggestions={["Search for Rings", "Search for Earrings", "Search for Necklaces", "Search for Bracelets", "Search for Mangalsutra"]} />
          </div>
          <div>
            <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="outline" className="border-[#FADDA0] text-[#FADDA0] rounded-md"><Menu className="w-5 h-5" /></Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="mt-4 bg-black rounded-lg shadow-md">
            {categories.map((category) => (
              <Link key={category} href={`/category/${category.trim().toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className="block px-4 py-2 text-sm font-medium text-white hover:bg-[#FADDA0] hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{category}</Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
