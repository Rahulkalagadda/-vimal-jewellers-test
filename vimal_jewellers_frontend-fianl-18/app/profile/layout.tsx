"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect logic handled by individual pages or middleware ideally
        return;
      }
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.profile);
        }
      } catch (err) {
        console.error("Failed to load profile for layout", err);
      }
    }
    fetchProfile();
  }, []);

  const sidebarLinks = [
    { label: "Account Information", href: "/profile" },
    { label: "My Orders", href: "/profile/orders" },
    { label: "My Wish List", href: "/profile/wishlist" },
    { label: "Address Book", href: "/profile/address-book" },
    { label: "Ekyc", href: "/profile/ekyc" },
    { label: "Saved Cards", href: "/profile/saved-cards" },
    { label: "My Wallet", href: "/profile/wallet" },
    { label: "My Schedule Call", href: "/profile/schedule-call" },
    { label: "DigiGold Locker", href: "/profile/digigold-locker" },
    { label: "Earn Rewards", href: "/profile/earn-rewards" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white shadow-md p-4 flex-shrink-0">
        <div className="text-center mb-6">
          <img
            src="/placeholder-user.jpg"
            alt="User Avatar"
            className="w-16 h-16 rounded-full mx-auto"
          />
          <p className="mt-2 text-sm font-medium">WELCOME,</p>
          <p className="text-lg font-semibold uppercase">
            {user?.firstName || user?.username || user?.email || "GUEST"}
          </p>
        </div>
        <nav className="space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.label}
                onClick={() => router.push(link.href)}
                className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${isActive
                  ? "text-[#009999] bg-teal-50 font-semibold border-l-4 border-[#009999]"
                  : "text-gray-700 hover:text-[#009999] hover:bg-gray-50"
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
        <Separator className="my-4" />
        <Button
          className="w-full bg-[#009999] text-white hover:bg-[#007a7a] py-2 rounded-md font-semibold"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/auth/sign-in";
          }}
        >
          LOGOUT
        </Button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
