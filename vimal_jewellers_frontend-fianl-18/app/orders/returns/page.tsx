"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Package, AlertCircle, CheckCircle } from "lucide-react"

export default function ReturnsPage() {
  useAuthGuard();
  const [orderId, setOrderId] = useState("")
  const [reason, setReason] = useState("")
  const [comments, setComments] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !reason) {
      alert("Please fill in Order ID and Reason for Return.")
      return
    }

    // Simulate API call
    console.log("Submitting return request:", { orderId, reason, comments })
    setSubmissionStatus("idle") // Reset status
    setTimeout(() => {
      // Simulate success or failure
      const success = Math.random() > 0.2 // 80% success rate
      if (success) {
        setSubmissionStatus("success")
        setOrderId("")
        setReason("")
        setComments("")
      } else {
        setSubmissionStatus("error")
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col bg-gray-50 text-gray-900">
      {/* Header Section */}
      <div className="bg-[#009999] text-white py-6 text-center">
        <h1 className="text-2xl font-bold">Initiate a Return</h1>
        <p className="text-sm mt-2">Easily return your items by filling out the form below.</p>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full">
        {/* Return Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Return Form</h2>
          <form onSubmit={handleSubmitReturn} className="space-y-6">
            <div>
              <Label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </Label>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <Input
                  id="orderId"
                  type="text"
                  placeholder="Enter your Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Return
              </Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged Product</SelectItem>
                  <SelectItem value="wrong-item">Wrong Item Received</SelectItem>
                  <SelectItem value="not-as-described">Not as Described</SelectItem>
                  <SelectItem value="changed-mind">Changed My Mind</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Comments (Optional)
              </Label>
              <Textarea
                id="comments"
                placeholder="Provide more details about your return"
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#009999] text-white hover:bg-[#007a7a] py-3 rounded-md font-semibold"
            >
              SUBMIT RETURN REQUEST
            </Button>
          </form>

          {submissionStatus === "success" && (
            <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Your return request has been submitted successfully!</span>
              <Button className="mt-4 bg-[#009999] text-white hover:bg-[#007a7a] py-2 rounded-md font-semibold">
                VIEW RETURN STATUS
              </Button>
            </div>
          )}
          {submissionStatus === "error" && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Failed to submit return request. Please try again.</span>
            </div>
          )}
        </div>

        {/* Return Policy Section */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Return Policy</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Returns must be initiated within 15 days of delivery.</li>
            <li>Items must be unused and in their original packaging.</li>
            <li>Refunds will be processed within 7-10 business days after approval.</li>
            <li>Shipping charges are non-refundable.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
