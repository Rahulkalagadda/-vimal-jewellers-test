"use client";

import { usePathname } from "next/navigation";
import Header from "../app/components/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  if (pathname === "/checkout") {
    return null;
  }

  return <Header />;
}
