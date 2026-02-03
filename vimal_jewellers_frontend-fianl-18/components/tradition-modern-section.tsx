"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { BACKEND_URL } from '@/lib/api';
import { MoveRight } from "lucide-react";

interface SectionConfig {
    largeImage?: string;
    largeTitle?: string;
    largeLink?: string;
    smallImage1?: string;
    smallTitle1?: string;
    smallLink1?: string;
    smallImage2?: string;
    smallTitle2?: string;
    smallLink2?: string;
}

interface TraditionModernSectionProps {
    config: SectionConfig;
    modernConfig?: SectionConfig;
}

export function TraditionModernSection({ config, modernConfig }: TraditionModernSectionProps) {
    const [activeTab, setActiveTab] = useState<'traditional' | 'modern'>('traditional');

    // Helper to fix local paths
    const getImageUrl = (path?: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BACKEND_URL}${path}`;
    };

    const activeConfig = activeTab === 'traditional' ? config : (modernConfig || config);

    if (!activeConfig) return null;

    const largeImage = getImageUrl(activeConfig.largeImage);
    const smallImage1 = getImageUrl(activeConfig.smallImage1);
    const smallImage2 = getImageUrl(activeConfig.smallImage2);

    return (
        <section className="container mx-auto px-4 py-8 mb-12 flex flex-col items-center">

            {/* Toggle Controls */}
            <div className="flex items-center gap-8 mb-8">
                <button
                    onClick={() => setActiveTab('traditional')}
                    className={`text-lg font-medium transition-colors duration-300 pb-1 ${activeTab === 'traditional'
                        ? "text-teal-900 border-b-2 border-teal-900"
                        : "text-gray-400 hover:text-gray-600"
                        } `}
                >
                    Traditional
                </button>
                <button
                    onClick={() => setActiveTab('modern')}
                    className={`text-lg font-medium transition-colors duration-300 pb-1 ${activeTab === 'modern'
                        ? "text-teal-900 border-b-2 border-teal-900"
                        : "text-gray-400 hover:text-gray-600"
                        } `}
                >
                    Modern
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-auto md:h-[550px] w-full max-w-6xl">

                {/* Left Column - Large Card */}
                <div className="relative group overflow-hidden rounded-2xl h-[400px] md:h-full w-full">
                    {largeImage ? (
                        <Link href={activeConfig.largeLink || "#"} className="block w-full h-full relative">
                            <Image
                                src={largeImage}
                                alt={activeConfig.largeTitle || "Collection"}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </Link>
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                </div>

                {/* Right Column - Stacked Cards */}
                <div className="flex flex-col gap-1 h-full">

                    {/* Top Right Card */}
                    <div className="relative group overflow-hidden rounded-2xl flex-1 h-[280px] md:h-full">
                        {smallImage1 ? (
                            <Link href={activeConfig.smallLink1 || "#"} className="block w-full h-full relative">
                                <Image
                                    src={smallImage1}
                                    alt={activeConfig.smallTitle1 || "Detail"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Link>
                        ) : (
                            <div className="w-full h-full bg-gray-100" />
                        )}
                    </div>

                    {/* Bottom Right Card */}
                    <div className="relative group overflow-hidden rounded-2xl flex-1 h-[280px] md:h-full">
                        {smallImage2 ? (
                            <Link href={activeConfig.smallLink2 || "#"} className="block w-full h-full relative">
                                <Image
                                    src={smallImage2}
                                    alt={activeConfig.smallTitle2 || "Detail"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Link>
                        ) : (
                            <div className="w-full h-full bg-gray-100" />
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
