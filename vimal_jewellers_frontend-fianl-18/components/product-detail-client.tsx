"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductInformation } from "@/components/product-information";
import { useToast } from "@/hooks/use-toast";

interface ProductImage {
  src: string;
  alt: string;
  type?: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  image?: string;
  currentPrice?: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  images?: ProductImage[] | string; // Can be string when coming from DB
  badges?: string[];
  youMayAlsoLike?: RelatedProduct[];
  reviews?: any[];
  grandTotal?: string;
  productSummary?: {
    [key: string]: string;
  };
  currentPrice?: string;
  price?: string;
  originalPrice?: string;
  mrp?: string;
  slug: string;
  shortcode: string;
  categoryId: number;
  collectionId: number;
  offerText?: string;
  metalRate?: {
    id: number;
    name: string;
    rate: string | number;
  };
  details?: {
    sku?: string;
    summary?: Record<string, string>;
    metalDetails?: string | string[];
    diamondDetails?: string | string[];
    [key: string]: any;
  };
  availableMetals?: { id: string; name: string; badge?: string }[];
  availableDiamonds?: { id: string; name: string; badge?: string }[];
  taxRate?: string | number;
  makingCharges?: string | number;
  priceBreakup?: { label: string; amount: string; original?: string }[];
  [key: string]: any; // For other fields we might receive
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Share2,
  Heart,
  Truck,
  Clock,
  Camera,
  MessageCircle,
  Phone,
  ChevronDown,
  TrendingUp,
  Crown,
  Gift,
  Book,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/section-header";
import { ProductSummaryCard } from "@/components/product-summary-card";
import { PriceBreakupAccordion } from "@/components/price-breakup-accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Carousel } from "@/components/ui/carousel";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ProductSizeSelector from "@/components/product-size-selector";

import { useRouter } from "next/navigation";
import { API_URL, BACKEND_URL } from "@/lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { useEffect, useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ProductGallery } from "@/components/product-gallery";
import { ChatEnquiryDialog } from "@/components/chat-enquiry-dialog";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("[DEBUG Frontend] Received Product:", product);
    console.log("[DEBUG Frontend] Available Metals:", product?.availableMetals);
    console.log("[DEBUG Frontend] Available Diamonds:", product?.availableDiamonds);
    console.log("[DEBUG Frontend] Price Breakup:", product?.priceBreakup);
  }, [product]);

  // Ensure product data is safe to use with defaults
  const safeProduct = useMemo(() => ({
    ...product,
    images: (function () {
      let imgs = product.images;
      if (typeof imgs === 'string') {
        try { imgs = JSON.parse(imgs); } catch (e) { imgs = []; }
      }
      if (Array.isArray(imgs) && imgs.length > 0) {
        return imgs.map((img: any) => {
          // Handle case where img is just a string (filename)
          if (typeof img === 'string') {
            return {
              src: img.startsWith('http') ? img : `${BACKEND_URL}/images/${img}`,
              alt: product.name || "Product Image"
            };
          }
          // Handle case where img is an object
          if (typeof img === 'object' && img !== null) {
            return {
              ...img,
              src: img.src?.startsWith('http') ? img.src : `${BACKEND_URL}/images/${img.src || img.name || ''}`
            };
          }
          return img;
        });
      }
      return [{
        src: "/placeholder.jpg",
        alt: product.name || "Product Image"
      }];
    })(),
    currentPrice: product.currentPrice || product.price || "0",
    originalPrice: product.originalPrice || product.mrp || "0",
    badges: Array.isArray(product.badges) ? product.badges : [],
    youMayAlsoLike: Array.isArray(product.youMayAlsoLike) ? product.youMayAlsoLike : []
  }), [product]);

  const router = useRouter();
  const dispatch = useDispatch();

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Disable body scroll when size selector is open
  useEffect(() => {
    if (showSizeSelector) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    }
  }, [showSizeSelector]);
  const [selectedRingSize, setSelectedRingSize] = useState<string | number | null>(null);

  // --- Dynamic Price Logic for Price Breakup ---
  const { productInfoData, calculatedFinalPrice, isDynamicPriceBreakup } = useMemo(() => {
    // Normalize productSummary coming from Admin (array of {key,value} or object)
    const normalizeSummary = (summary: any): Record<string, string> => {
      try {
        if (!summary) return {};
        // If persisted as JSON string
        if (typeof summary === "string") {
          const parsed = JSON.parse(summary);
          return typeof parsed === "object" && parsed !== null ? parsed : {};
        }
        // If array of { key, value }
        if (Array.isArray(summary)) {
          return summary.reduce((acc: any, item: any) => {
            const k = (item?.key ?? "").toString();
            const v = (item?.value ?? "").toString();
            if (k) acc[k] = v;
            return acc;
          }, {} as Record<string, string>);
        }
        // Already an object
        if (typeof summary === "object") return summary as Record<string, string>;
        return {};
      } catch {
        return {};
      }
    };

    const summaryObj = normalizeSummary((product as any).productSummary);
    // Helper to read case-insensitively
    const readKey = (obj: Record<string, string>, ...keys: string[]) => {
      const lower = Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
      for (const k of keys) {
        const v = lower[k.toLowerCase()];
        if (v !== undefined) return v as string;
      }
      return "";
    };

    let calculatedMetalCost = 0;
    let calculatedTaxAmount = 0;
    let calculatedFinalPrice = 0;
    let isDynamicPriceBreakup = false;
    let currentMakingCharges = 0;

    const weightStr = (readKey(summaryObj, "metalWeight", "metal weight", "weight", "net weight", "gold weight") || (product as any).metalWeight || "").toString().trim();
    const weightMatch = weightStr.match(/(\d+(\.\d+)?)/);
    const weight = weightMatch ? parseFloat(weightMatch[0]) : 0;
    let rate = 0;

    // 1. Check for Explicitly Linked Metal Rate (BEST)
    if (product.metalRate && product.metalRate.rate) {
      rate = typeof product.metalRate.rate === 'string'
        ? parseFloat(product.metalRate.rate)
        : Number(product.metalRate.rate);
    }

    // 2. Fallback: Metal string matching (Legacy)
    if (rate === 0) {
      const rates = (product as any).metalRates || [];
      const metalDetail = (JSON.stringify((product as any).metalDetails || "")).toLowerCase();

      if (metalDetail.includes("gold") || product.name.toLowerCase().includes("gold")) {
        const goldRate = rates.find((r: any) => r.name.toLowerCase().includes("gold"));
        rate = goldRate ? parseFloat(goldRate.rate) : 0;
      } else if (metalDetail.includes("silver") || product.name.toLowerCase().includes("silver")) {
        const silverRate = rates.find((r: any) => r.name.toLowerCase().includes("silver"));
        rate = silverRate ? parseFloat(silverRate.rate) : 0;
      }

      if (rate === 0 && rates.length > 0) {
        rate = parseFloat(rates[0].rate);
      }
    }

    if (weight > 0 && rate > 0) {
      isDynamicPriceBreakup = true;
      calculatedMetalCost = weight * rate;

      // Add Making Charges
      currentMakingCharges = product.makingCharges ? Number(product.makingCharges) : 0;
      const basePrice = calculatedMetalCost + currentMakingCharges;

      // Apply Tax on (Metal + Making)
      const taxPercentage = product.taxRate ? Number(product.taxRate) : 0;
      calculatedTaxAmount = (basePrice * taxPercentage) / 100;

      calculatedFinalPrice = Math.round(basePrice + calculatedTaxAmount);
    } else {
      // Fallback if no dynamic calculation
      calculatedFinalPrice = Math.round(Number((safeProduct.currentPrice || "0").replace(/,/g, "")));
    }

    // Map product fields to ProductInformation's expected prop structure
    const productInfoData = {
      title: product.name,
      description: product.description || "",
      image: Array.isArray(product.images) ? product.images[0]?.src : product.images || "",
      details: {
        summary: summaryObj,
        metalDetails: (product as any).metalDetails || [],
        diamondDetails: (product as any).diamondDetails || [],
      },
      priceBreakdown: {
        metal: {
          original: isDynamicPriceBreakup ? Math.round(calculatedMetalCost) : (Number(product.metalPrice) || 0),
          discounted: undefined
        },
        makingCharges: {
          original: isDynamicPriceBreakup ? Math.round(currentMakingCharges) : (Number(product.makingCharges) || 0),
          discounted: Number(product.makingChargesDiscounted) || undefined
        },
        gst: {
          original: isDynamicPriceBreakup ? Math.round(calculatedTaxAmount) : (Number(product.gst) || 0),
          discounted: undefined
        },
        grandTotal: calculatedFinalPrice,
      },
      grandTotal: calculatedFinalPrice,
      priceBreakup: product.priceBreakup // Pass dynamic breakup
    };

    return { productInfoData, calculatedFinalPrice, isDynamicPriceBreakup };
  }, [product, safeProduct]);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const wishlistProductIds = data.products?.map((p: any) => p.id.toString()) || [];
          setIsInWishlist(wishlistProductIds.includes(product.id.toString()));
        }
      } catch (error) {
        console.error("Failed to fetch wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [product.id]);

  const handleToggleWishlist = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        duration: 3000,
      });
      return;
    }

    // API_URL is imported from lib/api
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await fetch(`${API_URL}/wishlist/${product.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsInWishlist(false);
        // Trigger header wishlist count refresh
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist`,
          duration: 3000,
        });
      } else {
        // Add to wishlist
        await fetch(`${API_URL}/wishlist/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id }),
        });
        setIsInWishlist(true);
        // Trigger header wishlist count refresh
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
          duration: 3000,
        });
      }
    } catch (error) {
      // Quietly log or handle error
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        duration: 3000,
      });
    }
  }, [isInWishlist, product.id, product.name, toast]);

  // Map backend sizes to frontend format
  const sizeOptions = useMemo(() => Array.isArray(product.sizes)
    ? product.sizes.map((s: any) => ({
      size: s.size,
      diameter: s.diameter || "",
      availabilityStatus: s.availabilityStatus || "Made to Order"
    }))
    : [], [product.sizes]);

  const handleSizeSelect = (size: any) => {
    setSelectedRingSize(size.size);
  };

  const handleConfirm = (selectedSize: any) => {
    if (selectedSize && selectedSize.size) {
      setSelectedRingSize(selectedSize.size);
      setShowSizeSelector(false);

      // Show confirmation toast
      toast({
        title: "Size Selected!",
        description: `Ring size ${selectedSize.size} has been selected successfully.`,
        duration: 3000,
      });
    }
  };

  const handleAddToCart = useCallback(() => {
    dispatch(
      addToCart({
        id: String(safeProduct.id),
        name: safeProduct.name,
        // Use the calculated price if available, otherwise fall back to static
        price: calculatedFinalPrice > 0 ? calculatedFinalPrice : Number.parseFloat((safeProduct.currentPrice || "0").replace(/,/g, "")),
        quantity: 1,
        image: Array.isArray(safeProduct.images) && safeProduct.images[0]?.src || "/placeholder.jpg",
        metal: "14K Yellow Gold (1.51g)", // Mock metal detail
        ringSize: selectedRingSize || undefined,
      })
    );
    toast({
      title: "Added to Cart",
      description: `${safeProduct.name} has been added to your cart.${selectedRingSize ? ' Size: ' + selectedRingSize : ''}`,
      duration: 3000,
    });
  }, [dispatch, safeProduct, selectedRingSize, toast, calculatedFinalPrice]);

  const handleBuyNow = useCallback(() => {
    dispatch(
      addToCart({
        id: String(safeProduct.id),
        name: safeProduct.name,
        price: calculatedFinalPrice > 0 ? calculatedFinalPrice : Number.parseFloat((safeProduct.currentPrice || "0").replace(/,/g, "")),
        quantity: 1,
        image: safeProduct.images[0].src,
        metal: "14K Yellow Gold (1.51g)",
        ringSize: selectedRingSize || undefined,
      })
    );
    router.push("/checkout");
  }, [dispatch, safeProduct, selectedRingSize, router, calculatedFinalPrice]);



  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-quicksand">
      {/* Breadcrumb - Elegant Style */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-2 text-xs md:text-sm tracking-wide text-gray-500 uppercase font-medium">
          <Link href="/" className="hover:text-[#008080] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/category/jewellery" className="hover:text-[#008080] transition-colors">Jewellery</Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#008080] font-bold font-serif capitalize truncate max-w-[200px] md:max-w-none">{safeProduct.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 lg:p-6 w-full mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Section - Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={safeProduct.images} />
          </div>
          {/* Right Section - Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24 self-start">

            {/* Header & Price Section (Outside Card) */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-serif text-[#008080] mb-1">
                    {product.name}
                  </h1>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-full border-gray-200 text-gray-500 hover:text-[#008080]">
                    View Details <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-gray-100"><Share2 className="w-4 h-4 text-gray-400" /></Button>
                  <Button onClick={handleToggleWishlist} variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-gray-100">
                    <Heart className={cn("w-4 h-4", isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400")} />
                  </Button>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#009999]">
                  ₹{calculatedFinalPrice.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-green-600 text-xs font-bold uppercase bg-green-50 px-2 py-1 rounded">
                  You Save: ₹{(Number(product.originalPrice || 0) - calculatedFinalPrice).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Sizing & Selection Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] p-6">
              <div className="flex items-center justify-center mb-6 relative">
                <h2 className="text-xl font-serif text-[#1e3a8a] bg-white px-4 relative z-10">Sizing & Selection</h2>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-100 -z-0"></div>
                <span className="absolute -bottom-2 w-8 h-1 bg-[#009999] rounded-full"></span>
              </div>

              <div className="space-y-6">
                {/* Ring Size */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Select Ring Size</span>
                    <button onClick={() => setShowSizeSelector(true)} className="text-xs text-[#009999] underline decoration-dotted hover:decoration-solid">
                      Find your perfect size
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowSizeSelector(true)}
                    className="w-full justify-between h-12 rounded-xl border-gray-200 hover:border-[#009999] text-base font-normal"
                  >
                    <span>{selectedRingSize ? `${selectedRingSize}` : "Select Size"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>

                <Separator className="bg-gray-50" />

                {/* Customization */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Customization</span>
                    <button className="text-xs text-[#009999] underline decoration-dotted hover:decoration-solid">
                      Diamond Guide
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue={product.availableMetals?.[0]?.id || "14k-rose-gold"}>
                      <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 text-gray-700">
                        <SelectValue placeholder="Metal" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.availableMetals && product.availableMetals.length > 0 ? (
                          product.availableMetals.map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="14k-rose-gold">14k Rose Gold</SelectItem>
                            <SelectItem value="18k-yellow-gold">18k Yellow Gold</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <Select defaultValue={product.availableDiamonds?.[0]?.id || "si-ij"}>
                      <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 text-gray-700">
                        <SelectValue placeholder="Diamond" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.availableDiamonds && product.availableDiamonds.length > 0 ? (
                          product.availableDiamonds.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="si-ij">SI IJ</SelectItem>
                            <SelectItem value="vs-gh">VS GH</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Try On removed as per user request */}

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsChatOpen(true)}
              className="w-full h-12 rounded-xl border-[#009999] text-[#009999] hover:bg-teal-50 font-semibold tracking-wide flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              CHAT WITH EXPERTS
            </Button>

            {/* Delivery or Instore pickup Section */}
            <div className="pt-6 pb-2">
              <div className="text-center mb-6 relative">
                <h3 className="text-xl font-serif text-[#1e293b] mb-2">Delivery or Instore pickup</h3>
                <div className="w-8 h-1 bg-[#009999]/60 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 font-medium">Expected Delivery Date</span>
                  <button className="text-[#009999] underline hover:text-[#008080] font-medium text-xs">
                    Locate Me
                  </button>
                </div>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Enter Pincode"
                      className="h-12 pl-4 pr-10 rounded-xl border-gray-200 focus:border-[#009999] focus:ring-[#009999]/20"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#009999] fill-[#009999]/10" />
                  </div>
                  <Button className="h-12 px-6 bg-[#009999] hover:bg-[#008080] text-white rounded-xl font-semibold">
                    Check
                  </Button>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions (Add to Cart) */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#3dbdb6] hover:bg-[#34a8a2] text-white h-14 rounded-xl text-lg font-bold shadow-lg shadow-teal-500/20 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" /> ADD TO CART
              </Button>
            </div>
          </div>
        </div>

        <ChatEnquiryDialog
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
          defaultType="Chat"
        />

        {
          showSizeSelector && (
            <div className="fixed inset-0 z-50 flex items-end justify-end bg-[rgba(0,0,0,0.08)]" onClick={() => setShowSizeSelector(false)}>
              <div className="bg-white shadow-2xl w-full max-w-lg h-full flex flex-col right-0 animate-slideIn relative" onClick={(e) => e.stopPropagation()}>
                <ProductSizeSelector
                  currentPrice={Number(product.price || 0)}
                  originalPrice={Number(product.originalPrice || 0)}
                  deliveryDate="25th Jan 2026"
                  sizeOptions={sizeOptions}
                  metalOptions={product.availableMetals && product.availableMetals.length > 0 ? product.availableMetals : [
                    { id: '14k-rose-gold', name: '14K Rose Gold' },
                    { id: '14k-yellow-gold', name: '14K Yellow Gold' },
                    { id: '18k-yellow-gold', name: '18K Yellow Gold' }
                  ]}
                  diamondOptions={product.availableDiamonds && product.availableDiamonds.length > 0 ? product.availableDiamonds : [
                    { id: 'si-ij', name: 'SI IJ' },
                    { id: 'vs-gh', name: 'VS GH' },
                    { id: 'vvs-ef', name: 'VVS EF' }
                  ]}
                  onConfirm={(selection) => {
                    if (selection) {
                      setSelectedRingSize(selection.size ? selection.size.size : null);
                      // You can also store metal/diamond in state here if needed
                      // setConfig({ metal: selection.metal, diamond: selection.diamond });
                      console.log("Selected Configuration:", selection);
                    }
                    setShowSizeSelector(false);
                  }}
                  onClose={() => setShowSizeSelector(false)}
                />
              </div>
            </div>
          )
        }
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#009999] text-white py-3 px-4 flex items-center justify-between shadow-lg z-20">
          <span className="font-semibold">Offer Price: ₹{product.currentPrice}</span>
          <Button
            onClick={handleAddToCart}
            className="bg-white text-[#009999] hover:bg-gray-100 px-6 py-2 rounded-md font-semibold"
          >
            ADD TO CART
          </Button>
        </div>

        <div className="you-may-also-like-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {product.youMayAlsoLike?.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-lg shadow-md overflow-hidden">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <p className="text-center text-sm font-medium mt-2">{item.name}</p>
            </div>
          ))}
        </div>

        {/* Product Information Section */}
        <ProductInformation product={productInfoData} />
      </div >
    </div >
  );
}