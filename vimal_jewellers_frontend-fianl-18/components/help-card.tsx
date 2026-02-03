"use client";

import { useState } from "react";
import { API_URL } from '@/lib/api';
import { Phone, MessageCircle } from "lucide-react";
import { ChatEnquiryDialog } from "@/components/chat-enquiry-dialog";

export function HelpCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'Chat' | 'Call'>('Chat');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type })
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 2000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  const openForm = (contactType: 'Chat' | 'Call') => {
    setType(contactType);
    setIsOpen(true);
    setSuccess(false);
  };

  return (
    <>
      <div className="p-6 bg-[#f9f9f9]">
        <div className="pb-4">
          <h3 className="text-center text-sm font-semibold text-gray-800">Need help to find the best jewellery for you?</h3>
        </div>
        <div className="space-y-6">
          <p className="text-center text-xs text-gray-500">We are available for your assistance</p>

          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => openForm('Call')}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm group-hover:border-[#009999]/50 transition-all group-hover:scale-105">
                <Phone className="h-6 w-6 text-[#009999]" aria-hidden="true" />
                <span className="sr-only">Speak with Experts</span>
              </span>
              <span className="text-xs font-medium text-gray-600 group-hover:text-[#009999]">Speak with Experts</span>
            </div>

            <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => openForm('Chat')}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm group-hover:border-[#009999]/50 transition-all group-hover:scale-105">
                <MessageCircle className="h-6 w-6 text-[#009999]" aria-hidden="true" />
                <span className="sr-only">Chat with Experts</span>
              </span>
              <span className="text-xs font-medium text-gray-600 group-hover:text-[#009999]">Chat with Experts</span>
            </div>
          </div>
        </div>
      </div>

      <ChatEnquiryDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        defaultType={type}
      />
    </>
  );
}