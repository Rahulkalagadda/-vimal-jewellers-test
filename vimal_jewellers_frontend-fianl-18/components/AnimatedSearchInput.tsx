import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface AnimatedSearchInputProps {
  suggestions?: string[];
  className?: string;
  inputClassName?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Search for Rings",
  "Search for Earrings",
  "Search for Necklaces",
  "Search for Bracelets",
  "Search for Mangalsutra",
];

import { useRouter } from "next/navigation";

export const AnimatedSearchInput: React.FC<AnimatedSearchInputProps> = ({
  suggestions = DEFAULT_SUGGESTIONS,
  className = "",
  inputClassName = "",
}) => {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [value, setValue] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserTyping = value.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  };

  useEffect(() => {
    // ... existing effect logic ...
    if (isUserTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setShow(true);
      return;
    }
    intervalRef.current = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % suggestions.length);
        setShow(true);
      }, 300); // fade out duration
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isUserTyping, suggestions.length]);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isUserTyping ? "" : suggestions[index]
        }
        className={`pl-12 pr-4 py-2 rounded-full bg-black border border-[#FADDA0] focus:ring-2 focus:ring-[#FADDA0]/40 focus:border-[#FADDA0] text-white placeholder:font-light placeholder:text-gray-300 transition-shadow duration-200 shadow-md w-full ${inputClassName}`}
        style={{
          transition: 'box-shadow 0.2s',
        }}
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FADDA0] pointer-events-none">
        <Search className="w-5 h-5" />
      </span>
      {/* Animated placeholder overlay for fade effect */}
      {!isUserTyping && (
        <span
          className={`pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-gray-300 font-light select-none transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
          style={{
            zIndex: 2,
            userSelect: 'none',
            fontSize: '1rem',
          }}
        >
          {suggestions[index]}
        </span>
      )}
    </div>
  );
};
