"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SizeOption {
  size: string | number
  diameter?: string | number
  availabilityStatus: "In Stock" | "Made to Order" | string
}

interface ProductSizeSelectorProps {
  currentPrice: number
  originalPrice?: number
  currency?: string
  deliveryDate: string
  sizeOptions: SizeOption[]
  metalOptions?: { id: string; name: string; badge?: string }[]
  diamondOptions?: { id: string; name: string; badge?: string }[]
  onSizeSelect?: (size: SizeOption) => void
  onConfirm?: (selection: { size: SizeOption | null, metal: string, diamond: string } | null) => void
  onClose?: () => void
}

const defaultMetalOptions = [
  { id: '18k-rose', name: '18K Rose Gold', badge: 'Made to Order' },
  { id: '14k-rose', name: '14K Rose Gold', badge: 'Made to Order' },
];

const defaultDiamondOptions = [
  { id: 'si-ij', name: 'SI IJ', badge: 'Made to Order' },
  { id: 'si-gh', name: 'SI GH', badge: 'Made to Order' },
];

export default function ProductSizeSelector({
  currentPrice,
  originalPrice,
  currency = "₹",
  deliveryDate,
  sizeOptions,
  metalOptions = [],
  diamondOptions = [],
  onSizeSelect,
  onConfirm,
  onClose,
}: ProductSizeSelectorProps) {
  const activeMetalOptions = (metalOptions && metalOptions.length > 0) ? metalOptions : defaultMetalOptions;
  const activeDiamondOptions = (diamondOptions && diamondOptions.length > 0) ? diamondOptions : defaultDiamondOptions;

  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedMetal, setSelectedMetal] = useState(activeMetalOptions[0]?.id);
  const [selectedDiamond, setSelectedDiamond] = useState(activeDiamondOptions[0]?.id);

  const handleConfirm = () => {
    onConfirm?.({
      size: selectedSize,
      metal: selectedMetal,
      diamond: selectedDiamond
    });
  };

  const formatPrice = (price: number) => {
    return `${currency}${price.toLocaleString('en-IN')}`;
  };

  // Improved Metal Color Gradients - Glossy Effect
  const getMetalGradient = (id: string, name: string) => {
    const lower = (id + name).toLowerCase();
    if (lower.includes('rose')) return "bg-gradient-to-br from-[#fdece4] via-[#f7d4d4] to-[#fdece4]"; // Rose Gold Gloss
    if (lower.includes('yellow')) return "bg-gradient-to-br from-[#fffcdb] via-[#fceea4] to-[#fffcdb]"; // Yellow Gold Gloss
    if (lower.includes('white') || lower.includes('silver')) return "bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#f8f9fa]"; // White Gold Gloss
    return "bg-gray-50";
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-white h-full flex flex-col font-sans shadow-2xl animate-in slide-in-from-right duration-300">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f4fbfc] flex-shrink-0 border-b border-[#f0f9fa]">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#009999]">{formatPrice(currentPrice)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through decoration-gray-400">{formatPrice(originalPrice)}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Delivery by {deliveryDate}</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8 custom-scrollbar">

        {/* Metal Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-3">Pick your Metal</h3>
          <div className="flex flex-wrap gap-4">
            {activeMetalOptions.map((metal) => (
              <button
                key={metal.id}
                onClick={() => setSelectedMetal(metal.id)}
                className={cn(
                  "relative flex flex-col items-center w-[140px] h-[75px] rounded-lg transition-all overflow-hidden",
                  selectedMetal === metal.id
                    ? cn("border border-[#4fd1c5] shadow-sm", getMetalGradient(metal.id, metal.name))
                    : "bg-[#f3f4f6] border border-transparent"
                )}
              >
                {/* Content Container */}
                <div className="flex flex-col items-center justify-center flex-1 w-full pt-1 pb-4">
                  <span className="text-[13px] font-bold text-gray-800 leading-tight px-1 text-center font-serif">
                    {metal.name}
                  </span>
                </div>

                {/* Badge - Absolute Positioned at Bottom Center - Overlaying */}
                <div className="absolute bottom-1 w-full flex justify-center">
                  <span className={cn(
                    "px-3 py-[2px] rounded-full text-[9px] font-medium border bg-white shadow-sm z-10 whitespace-nowrap",
                    selectedMetal === metal.id
                      ? "text-[#009999] border-[#009999]/30"
                      : "text-gray-500 border-gray-200"
                  )}>
                    {metal.badge || "Made to Order"}
                  </span>
                </div>

                {/* Check Icon - Top Right Corner */}
                {selectedMetal === metal.id && (
                  <div className="absolute top-0 right-0 bg-[#009999] text-white rounded-bl-md p-[2px] z-20 w-5 h-5 flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Diamond Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-3">Pick your Diamond Quality</h3>
          <div className="flex flex-wrap gap-4">
            {activeDiamondOptions.map((diamond) => (
              <button
                key={diamond.id}
                onClick={() => setSelectedDiamond(diamond.id)}
                className={cn(
                  "relative flex flex-col items-center w-[140px] h-[75px] rounded-lg transition-all overflow-hidden",
                  selectedDiamond === diamond.id
                    ? "bg-[#6dd5ed] border border-[#6dd5ed]" // Bright Teal
                    : "bg-[#f3f4f6] border border-transparent"
                )}
              >
                {/* Content */}
                <div className="flex flex-col items-center justify-center flex-1 w-full pt-1 pb-4">
                  {/* Diamond Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("mb-0.5", selectedDiamond === diamond.id ? "text-white" : "text-gray-400 opacity-50")}>
                    <path d="M12 2L2 9L12 22L22 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className={cn("text-[13px] font-bold font-serif", selectedDiamond === diamond.id ? "text-white" : "text-gray-800")}>
                    {diamond.name}
                  </span>
                </div>

                {/* Badge */}
                <div className="absolute bottom-1 w-full flex justify-center">
                  <span className={cn(
                    "px-3 py-[2px] rounded-full text-[9px] font-medium bg-white border border-gray-100 shadow-sm whitespace-nowrap",
                    selectedDiamond === diamond.id ? "text-[#009999]" : "text-gray-500"
                  )}>
                    {diamond.badge || "Made to Order"}
                  </span>
                </div>

                {/* Check Icon */}
                {selectedDiamond === diamond.id && (
                  <div className="absolute top-0 right-0 bg-[#007f7f] text-white rounded-bl-md p-[2px] z-20 w-5 h-5 flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="pb-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Pick your Size</h3>
          <div className="grid grid-cols-3 gap-3">
            {sizeOptions.map((option, idx) => {
              const isSelected = selectedSize?.size === option.size;
              return (
                <button
                  key={idx}
                  onClick={() => { setSelectedSize(option); onSizeSelect?.(option); }}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg transition-all h-[75px]",
                    isSelected
                      ? "bg-[#4fd1c5] text-white shadow-md shadow-teal-500/20"
                      : "bg-[#f8f9fa] hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <div className="flex flex-col items-center leading-tight mb-3">
                    <span className={cn("text-[10px]", isSelected ? "text-white/90" : "text-gray-500")}>Size: {option.size}</span>
                    <span className={cn("text-sm font-bold", isSelected ? "text-white" : "text-gray-900")}>{option.diameter} mm</span>
                  </div>

                  <div className="absolute bottom-1.5 w-full flex justify-center">
                    <span className={cn(
                      "px-2 py-[1px] rounded-full text-[9px] font-medium bg-white whitespace-nowrap shadow-sm",
                      isSelected ? "text-[#009999]" : "text-gray-500 border border-gray-200"
                    )}>
                      Start Order
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button
          onClick={handleConfirm}
          disabled={!selectedSize}
          className="w-full h-12 bg-[#76d6d2] hover:bg-[#5ac8c4] text-white font-bold text-lg tracking-wider uppercase rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CONFIRM SELECTION
        </Button>
      </div>
    </div>
  );
}
