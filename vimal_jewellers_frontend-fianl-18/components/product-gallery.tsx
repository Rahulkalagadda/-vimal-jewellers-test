"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ProductImage {
    src: string;
    alt: string;
    type?: string;
}

interface ProductGalleryProps {
    images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [validImages, setValidImages] = useState<ProductImage[]>([]);

    useEffect(() => {
        // Filter out non-image types if any, or placeholder handling
        const filtered = images.filter(
            (img) => !img.type || img.type === "image"
        );
        setValidImages(filtered.length > 0 ? filtered : [{ src: "/placeholder.jpg", alt: "Product Image" }]);
    }, [images]);

    if (validImages.length === 0) return null;

    return (
        <div className="w-full h-full">
            {/* Desktop Grid Layout */}
            <div className="hidden lg:grid grid-cols-2 gap-1">
                {validImages.map((img, idx) => {
                    // Logic: If it's the only image, make it huge (span 2).
                    // If there are 3 images, maybe make the first one huge?
                    // For now, let's keep it simple: 2-column grid.
                    // BUT if there is only 1 image, force it to cover full width.
                    const isSingle = validImages.length === 1;

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "relative w-full bg-white cursor-zoom-in group overflow-hidden",
                                // Single image = Huge Hero (Landscape/Square hybrid), Multiple = Square (Standard)
                                isSingle ? "col-span-2 aspect-[4/3]" : "aspect-square"
                            )}
                        >
                            <Zoom>
                                <div className="relative w-full h-full">
                                    <img
                                        src={img.src}
                                        alt={img.alt || `Product View ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                        style={{ display: 'block' }}
                                    />
                                </div>
                            </Zoom>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Swipe-able Carousel (Simplified) */}
            <div className="lg:hidden relative w-full aspect-[4/5] bg-white overflow-hidden">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
                    {validImages.map((img, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 snap-center relative h-full">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
                {/* Mobile Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {validImages.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all",
                                selectedIndex === idx ? "bg-[#009999] w-3" : "bg-gray-300"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
