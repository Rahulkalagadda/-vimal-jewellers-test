import Link from "next/link"
import { ShoppingBag, MapPin, CreditCard, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutProgressProps {
  currentStep: "bag" | "address" | "payment" | "success"
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: "bag", name: "Bag", icon: ShoppingBag, href: "/checkout" },
    { id: "address", name: "Address", icon: MapPin, href: "/checkout/address" },
    { id: "payment", name: "Payment", icon: CreditCard, href: "/checkout/payment" },
  ]

  return (
    <div className="bg-gray-900 text-white py-4 px-4 md:px-8 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-white">
      VIMAL JEWELLERS
        <span className="block text-xs font-normal text-gray-400">LIFESTYLE JEWELLERY</span>
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2",
                currentStep === step.id
                  ? "bg-[#009999] border-[#009999] text-white"
                  : "bg-gray-700 border-gray-600 text-gray-400",
              )}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium hidden md:block",
                currentStep === step.id ? "text-white" : "text-gray-400",
              )}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 md:w-16 h-0.5 mx-2",
                  currentStep === step.id || steps.findIndex((s) => s.id === currentStep) > index
                    ? "bg-[#009999]"
                    : "bg-gray-600",
                )}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Lock className="w-6 h-6 text-[#009999]" />
        <span className="text-sm text-gray-400 hidden md:block">SECURE</span>
      </div>
    </div>
  )
}
