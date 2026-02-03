"use client";

import { useState } from "react";
import { API_URL } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface ChatEnquiryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultType?: 'Chat' | 'Call';
}

export function ChatEnquiryDialog({ open, onOpenChange, defaultType = 'Chat' }: ChatEnquiryDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // If defaultType prop changes, we might want to respect it, but usually the parent controls which "mode" triggered it.
    // For now we'll assume the title mirrors the defaultType passed in.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const res = await fetch(`${API_URL}/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: defaultType })
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ name: '', phone: '', email: '', message: '' });
                // Close dialog after 2 seconds
                setTimeout(() => {
                    onOpenChange(false);
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center font-serif text-xl">
                        {defaultType === 'Chat' ? 'Chat with our Experts' : 'Request a Callback'}
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-gray-500">
                        Fill in your details and we will {defaultType === 'Chat' ? 'get back to you shortly' : 'call you back'}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-6 text-green-600">
                        <span className="text-4xl mb-2">✓</span>
                        <p className="font-semibold">Request Received!</p>
                        <p className="text-sm text-gray-600">We will contact you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your name"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                            <Input
                                required
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter your mobile number"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                            <Textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Any specific query?"
                                className="min-h-[80px]"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-[#008080] hover:bg-[#006666] text-white font-bold tracking-wide h-11" disabled={loading}>
                            {loading ? 'Submitting...' : 'SUBMIT REQUEST'}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
