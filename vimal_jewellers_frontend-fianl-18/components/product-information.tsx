"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Sparkles } from "lucide-react"
import { HelpCard } from "@/components/help-card"

interface PriceBreakdown {
  metal: { original: number; discounted?: number }
  diamond?: { original: number; discounted?: number }
  makingCharges: { original: number; discounted?: number }
  gst: { original: number; discounted?: number }
  grandTotal: number
}

interface ProductDetails {
  metalDetails?: string[] | string
  diamondDetails?: string[] | string
  // Allow dynamic string keys for summary
  summary?: Record<string, string>
}

interface ProductData {
  title: string
  description: string
  image: string
  details: ProductDetails
  priceBreakdown: PriceBreakdown
  priceBreakup?: { label: string; amount: string; original?: string }[]
}

interface ProductInformationProps {
  product: ProductData
}

export function ProductInformation({ product }: ProductInformationProps) {
  const [metalDetailsOpen, setMetalDetailsOpen] = useState(false)
  const [diamondDetailsOpen, setDiamondDetailsOpen] = useState(false)
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(true)

  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white font-sans">
      {/* Centered Header */}
      <div className="text-center mb-10 relative">
        <h2 className="text-3xl font-serif text-[#1e293b] mb-3">Product Information</h2>
        <div className="w-10 h-1 bg-[#009999] opacity-80 mx-auto rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
        {/* Left Column: Product Summary & Help (Span 5) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Product Summary Card */}
          <div className="bg-[#f9f9f9] rounded-xl p-6 border border-[#b2dfdb]">
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Product Summary</h3>
            <div className="space-y-0">
              {product.details.summary && Object.entries(product.details.summary).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 border-dashed last:border-0">
                  <span className="text-gray-500 text-sm font-medium">{key}</span>
                  <span className="font-semibold text-gray-900 text-sm">{value}</span>
                </div>
              ))}
              {(!product.details.summary || Object.keys(product.details.summary).length === 0) && (
                <div className="text-center text-gray-400 text-sm py-4">No summary available</div>
              )}
            </div>
            <div className="mt-4 pt-2">
              <p className="text-[10px] text-gray-400 leading-tight italic">
                *Difference in gold weight may occur & will apply on final price.
              </p>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-[#f9f9f9] rounded-xl border border-[#b2dfdb] overflow-hidden">
            <HelpCard />
          </div>
        </div>

        {/* Right Column: Accordions (Span 7) */}
        <div className="lg:col-span-8 space-y-2">

          {/* Price Breakup */}
          <Collapsible open={priceBreakdownOpen} onOpenChange={setPriceBreakdownOpen} className="border border-gray-100 rounded-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center px-4 py-3 bg-[#f5f5f5] cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase">PRICE BREAKUP</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${priceBreakdownOpen ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 bg-white space-y-4">
                {product.priceBreakup && product.priceBreakup.length > 0 ? (
                  // Dynamic Rendering
                  <>
                    {(() => {
                      // Helper to parse amount string to number
                      const parseAmount = (str: string) => {
                        if (!str) return 0;
                        return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
                      };

                      // Calculate Sum of all rows
                      const calculatedTotal = product.priceBreakup.reduce((sum, item) => sum + parseAmount(item.amount), 0);

                      // Check if a "Total" row already exists (to avoid double displaying)
                      const hasTotalValues = product.priceBreakup.some(item =>
                        item.label.toLowerCase().includes('total') ||
                        item.label.toLowerCase().includes('grand')
                      );

                      // Render rows
                      return (
                        <>
                          {product.priceBreakup.map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center ${item.label.toLowerCase().includes('total') ? 'pt-4 mt-2' : 'border-b border-gray-100 pb-3 last:border-0'}`}>
                              <span className={`${item.label.toLowerCase().includes('total') ? 'font-bold text-gray-800 text-base' : 'text-gray-500 text-sm'}`}>
                                {item.label}
                              </span>
                              <div className="text-right flex flex-col items-end">
                                {item.original && (
                                  <span className="text-xs text-gray-400 line-through decoration-red-300 decoration-2">
                                    {item.original}
                                  </span>
                                )}
                                <div className={`${item.label.toLowerCase().includes('total') ? 'font-bold text-gray-900 text-xl font-serif' : 'font-medium text-gray-900 font-mono'}`}>
                                  {item.amount}
                                </div>
                                {item.label.toLowerCase().includes('total') && (
                                  <div className="text-[10px] text-gray-500 font-medium">(MRP Incl. of all taxes)</div>
                                )}
                              </div>
                            </div>
                          ))}

                          {/* Auto-Calculated Total Row if not present */}
                          {!hasTotalValues && (
                            <div className="flex justify-between items-center pt-4 mt-2">
                              <span className="font-bold text-gray-800 text-base">Grand Total</span>
                              <div className="text-right">
                                <div className="font-bold text-gray-900 text-xl font-serif">
                                  {formatPrice(calculatedTotal)}
                                </div>
                                <div className="text-[10px] text-gray-500 font-medium">(MRP Incl. of all taxes)</div>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  // Default Auto-Calculated Rendering
                  <>
                    <div className="flex justify-between items-baseline border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-gray-500 text-sm">Metal</span>
                      <span className="font-medium text-gray-900 font-mono">
                        {formatPrice(product.priceBreakdown.metal.original)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-gray-500 text-sm">Diamond</span>
                      <div className="text-right">
                        {product.priceBreakdown.diamond && product.priceBreakdown.diamond.original > 0 ? (
                          <span className="font-medium text-gray-900 font-mono">
                            {formatPrice(product.priceBreakdown.diamond.original)}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-gray-500 text-sm">Making Charges</span>
                      <div className="text-right">
                        {product.priceBreakdown.makingCharges.discounted ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 line-through decoration-red-300 decoration-2">
                              {formatPrice(product.priceBreakdown.makingCharges.original)}
                            </span>
                            <span className="font-medium text-gray-900 font-mono">
                              {formatPrice(product.priceBreakdown.makingCharges.discounted)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900 font-mono">
                            {formatPrice(product.priceBreakdown.makingCharges.original)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-gray-500 text-sm">GST (3%)</span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900 font-mono">
                          {formatPrice(product.priceBreakdown.gst.discounted || product.priceBreakdown.gst.original)}
                        </span>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-center pt-4 mt-2">
                      <span className="font-bold text-gray-800 text-base">Grand Total</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-xl font-serif">
                          {formatPrice(product.priceBreakdown.grandTotal)}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">(MRP Incl. of all taxes)</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Metal Details */}
          <Collapsible open={metalDetailsOpen} onOpenChange={setMetalDetailsOpen} className="border border-gray-100 rounded-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center px-4 py-3 bg-[#f5f5f5] cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase">METAL DETAILS</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${metalDetailsOpen ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 bg-white text-sm text-gray-600 leading-relaxed">
                {/* Content implementation same as before */}
                {product.details.metalDetails ? (
                  Array.isArray(product.details.metalDetails) ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details.metalDetails.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  ) : typeof product.details.metalDetails === "string" && product.details.metalDetails.trim() !== "" ? (
                    <p>{product.details.metalDetails}</p>
                  ) : (
                    <p>14k & 18k yellow and rose gold. It's a timeless symbol of flow, balance, and beauty.</p>
                  )
                ) : (
                  <p>14k & 18k yellow and rose gold. It's a timeless symbol of flow, balance, and beauty.</p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Diamond Details */}
          <Collapsible open={diamondDetailsOpen} onOpenChange={setDiamondDetailsOpen} className="border border-gray-100 rounded-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center px-4 py-3 bg-[#f5f5f5] cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase">DIAMOND DETAILS</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${diamondDetailsOpen ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 bg-white text-sm text-gray-600 leading-relaxed">
                {/* Content implementation same as before */}
                {product.details.diamondDetails ? (
                  Array.isArray(product.details.diamondDetails) ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details.diamondDetails.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  ) : typeof product.details.diamondDetails === "string" && product.details.diamondDetails.trim() !== "" ? (
                    <p>{product.details.diamondDetails}</p>
                  ) : (
                    <p>Premium quality diamonds with excellent cut, clarity, and brilliance.</p>
                  )
                ) : (
                  <p>Premium quality diamonds with excellent cut, clarity, and brilliance.</p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="pt-2 pl-1">
            <p className="text-[10px] text-gray-400 italic">
              *A differential amount will be applicable with difference in weight if any.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
