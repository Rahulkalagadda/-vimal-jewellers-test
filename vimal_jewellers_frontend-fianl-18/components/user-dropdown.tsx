
"use client"
import { useState } from "react";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from 'lucide-react'

export function UserDropdown() {

  const [showConfirm, setShowConfirm] = useState(false);
  const isSignedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/auth/sign-in";
    }
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };
 
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5 text-[#FADDA0]" />
            <span className="sr-only">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
          {isSignedIn ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="block w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="block w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2">My Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders/track" className="block w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2">Track Order</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders/returns" className="block w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2">Returns</Link>
              </DropdownMenuItem>
              <div className="border-t my-2" />
              <DropdownMenuItem>
                <button onClick={handleLogout} className="block w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2">Logout</button>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/auth/sign-in" className="block w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auth/sign-up" className="block w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2">Sign Up</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to logout?</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={cancelLogout}>Cancel</Button>
              <Button variant="destructive" onClick={confirmLogout}>Logout</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
