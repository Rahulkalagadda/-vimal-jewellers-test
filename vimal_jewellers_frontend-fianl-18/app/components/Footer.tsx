"use client";
import {
  Facebook,
  Instagram,
  X,
  Youtube,
  MessageCircle,
  PinIcon as Pinterest,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchSettings, fetchFooterConfigs } from "@/lib/api";

const Footer = () => {
  const [footerConfigs, setFooterConfigs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    contactNumber: "+91 22 61066262",
    contactTiming: "(9am-7pm, 6 days a week)",
    supportEmail: "support@VIMALJEWELLERS.com",
    facebookLink: "#",
    instagramLink: "#",
    twitterLink: "#",
    youtubeLink: "#",
    pinterestLink: "#",
    whatsappLink: "#"
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to load footer settings", error);
      }
    };

    const loadFooterConfigs = async () => {
      try {
        const data = await fetchFooterConfigs();
        if (data) {
          setFooterConfigs(data);
        }
      } catch (error) {
        console.error("Failed to load footer configs", error);
      }
    }

    loadSettings();
    loadFooterConfigs();
  }, []);

  return (
    <>
      <section className="bg-gray-900 text-white py-16 px-4 md:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">Get in the Know</h2>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          Sign up to our newsletter for information on sales, delightful content
          and new additions to the collection. :
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            className="flex-grow bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-full px-6 py-3"
          />
          <Input
            type="tel"
            placeholder="Your mobile number"
            className="flex-grow bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-full px-6 py-3"
          />
          <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
            SUBSCRIBE NOW
          </Button>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 text-sm">
          {footerConfigs.length > 0 ? (
            footerConfigs.map((config: any) => (
              <div className="space-y-3" key={config.id}>
                <h3 className="text-base font-semibold mb-2 border-b border-gray-700 pb-2 uppercase">
                  {config.title}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  {config.links && Array.isArray(config.links) && config.links.map((link: any, index: number) => (
                    <li key={index}>
                      <Link href={link.url} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            // Fallback content if no configs found (optional, or just empty)
            <>
              {/* Default About Us */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold mb-2 border-b border-gray-700 pb-2">ABOUT US</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/pages/about-us" className="hover:text-white">About Our Company</Link></li>
                  <li><Link href="/pages/terms-and-conditions" className="hover:text-white">Terms and Conditions</Link></li>
                </ul>
              </div>
            </>
          )}

          {/* CONTACT US */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-2 border-b border-gray-700 pb-2">
              CONTACT US
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>{settings.contactNumber}</li>
              <li>{settings.contactTiming}</li>
              <li>
                <Link
                  href={`mailto:${settings.supportEmail}`}
                  className="hover:text-white"
                >
                  {settings.supportEmail}
                </Link>
              </li>

            </ul>
          </div>

          {/* FOLLOW US */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-2 border-b border-gray-700 pb-2">
              FOLLOW US
            </h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {settings.facebookLink && (
                <Link
                  href={settings.facebookLink}
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full hover:opacity-80"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings.instagramLink && (
                <Link
                  href={settings.instagramLink}
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center bg-pink-600 rounded-full hover:opacity-80"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings.twitterLink && (
                <Link
                  href={settings.twitterLink}
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:opacity-80"
                >
                  <X className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings.youtubeLink && (
                <Link
                  href={settings.youtubeLink}
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:opacity-80"
                >
                  <Youtube className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings.pinterestLink && (
                <Link
                  href={settings.pinterestLink}
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center bg-red-700 rounded-full hover:opacity-80"
                >
                  <Pinterest className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings.whatsappLink && (
                <Link
                  href={settings.whatsappLink}
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center bg-green-500 rounded-full hover:opacity-80"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} VIMAL JEWELLERS.COM . ALL RIGHTS RESERVED.{" "}
            <Link href="#" className="hover:text-white">
              SITE MAP
            </Link>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
            <span className="font-semibold">WE ACCEPT</span>
            <Image
              src="/placeholder.svg?height=20&width=40"
              alt="Visa"
              width={40}
              height={20}
              className="h-5 object-contain"
            />
            <Image
              src="/placeholder.svg?height=20&width=40"
              alt="Mastercard"
              width={40}
              height={20}
              className="h-5 object-contain"
            />
            <Image
              src="/placeholder.svg?height=20&width=40"
              alt="Paytm"
              width={40}
              height={20}
              className="h-5 object-contain"
            />
            <Image
              src="/placeholder.svg?height=20&width=40"
              alt="RuPay"
              width={40}
              height={20}
              className="h-5 object-contain"
            />
            <Image
              src="/placeholder.svg?height=20&width=40"
              alt="Cash on Delivery"
              width={40}
              height={20}
              className="h-5 object-contain"
            />
            <Image
              src="/placeholder.svg?height=20&width=40"
              alt="PayPal"
              width={40}
              height={20}
              className="h-5 object-contain"
            />
            <Image
              src="/placeholder.svg?height=20&width=40"
              alt="American Express"
              width={40}
              height={20}
              className="h-5 object-contain"
            />
          </div>
        </div>
      </footer>

    </>
  );
};

export default Footer;
