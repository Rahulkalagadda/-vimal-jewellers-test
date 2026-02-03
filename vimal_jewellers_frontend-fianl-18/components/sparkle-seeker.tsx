import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SparkleSeekerProps {
    config?: {
        title?: string;
        description?: string;
        buttonText?: string;
        buttonUrl?: string;
    };
}

export function SparkleSeekerBanner({ config }: SparkleSeekerProps) {
    const {
        title = "Hey Sparkle Seeker,",
        description = "Come, explore a world where diamonds aren't just for occasions, they're for every day, every mood, and every you.",
        buttonText = "DISCOVER MORE",
        buttonUrl = "/category/all"
    } = config || {};

    return (
        <section className="relative w-full py-20 px-4 overflow-hidden bg-gradient-to-r from-gray-900 via-[#0a192f] to-black text-center">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-500 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
                {/* Icon */}
                <div className="mb-2">
                    <Sparkles className="w-10 h-10 text-teal-400 opacity-80 animate-pulse" />
                </div>

                {/* Headline */}
                <h2
                    className="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-400 drop-shadow-sm"
                    style={{ fontFamily: 'var(--font-dancing)', lineHeight: 1.2 }}
                >
                    {title}
                </h2>

                {/* Body Text */}
                <p
                    className="text-xl md:text-2xl text-gray-300 font-light tracking-wide max-w-3xl leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                >
                    {description}
                </p>

                {/* CTA */}
                <div className="pt-8">
                    <Link href={buttonUrl}>
                        <Button
                            className="bg-transparent border border-white/30 hover:bg-white hover:text-black text-white px-8 py-6 rounded-full text-lg tracking-widest transition-all duration-300 hover:scale-105"
                        >
                            {buttonText}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
