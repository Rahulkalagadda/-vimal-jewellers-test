"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { signupUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    const result = await signupUser({
      username: form.username,
      email: form.email,
      password: form.password,
    });
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("");
      router.push("/auth/sign-in?success=1");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="Vimal Jewellers Logo"
            width={60}
            height={60}
            className="object-cover h-auto mix-blend-difference mx-auto"
            // Adjust object position to show SRK
            priority
          />
          <p className="text-xs text-gray-600">VIMAL JEWELLERS</p>
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">
            Create Your Account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#009999] focus:ring-[#009999]"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#009999] focus:ring-[#009999]"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#009999] focus:ring-[#009999]"
            />
          </div>
          <div>
            <Label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#009999] focus:ring-[#009999]"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-md bg-[#009999] py-2 text-lg font-semibold text-white hover:bg-[#007a7a]"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        <div className="mt-8 text-center text-sm text-gray-600">
          {"Already have an account? "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-[#009999] hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
