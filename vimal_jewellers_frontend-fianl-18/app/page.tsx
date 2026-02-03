"use client";
import ReduxProvider from "@/components/redux-provider";
import { Button } from "@/components/ui/button";
import { CardCarousel } from "@/components/ui/card-carousel";
import {
  Baby,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Facebook,
  Gift,
  Instagram,
  Linkedin,
  Menu,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Twitter,
  Youtube,
  Cake,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { HeroCarousel } from "@/components/ui/hero-carousel";
import { fetchHomeData, bookAppointment } from "@/lib/api";
import { VideoSection } from "@/components/video-section";
import { useToast } from "@/hooks/use-toast";
import { SparkleSeekerBanner } from "@/components/sparkle-seeker";
import { TraditionModernSection } from "@/components/tradition-modern-section";

export default function Component() {
  const [Active, setActive] = useState(0);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    message: ""
  });

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData({ ...bookingData, [e.target.id]: e.target.value });
  };

  const handleBookingSubmit = async () => {
    try {
      const result = await bookAppointment(bookingData);
      toast({
        title: "Appointment Booked!",
        description: "We have received your request and will contact you shortly.",
        duration: 5000,
      });
      setAppointmentOpen(false);
      setBookingData({ name: "", phone: "", email: "", date: "", time: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const homeData = await fetchHomeData();
        setData(homeData);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }



  const { banners, sectionImages, categories, collections, gifts, homeData, subBanners, videos } = data || {};

  // Use API data if available and not empty, otherwise use fallbacks
  const heroImages = (banners && banners.length > 0) ? banners.map((b: any) => ({ src: b.image, alt: "Banner", ...b })) : [];
  const flairImages = (sectionImages && sectionImages.length > 0)
    ? sectionImages.filter((s: any) => ["Tradition Reimagined", "Curated for the Bold"].includes(s.name))
    : [];
  const shopCategories = (categories && categories.length > 0) ? categories : [];
  const shopCollections = (collections && collections.length > 0) ? collections : [];
  const giftItems = (gifts && gifts.length > 0) ? gifts : [];

  // Secondary Images (Sub Banners)
  const secondaryImages = (subBanners && subBanners.length > 0) ? subBanners.map((b: any) => ({ src: b.image, alt: "Secondary Banner", ...b })) : [];

  // Background Images
  const giftSectionBg = homeData?.giftSectionBg || "";
  const storeSectionBg = homeData?.storeSectionBg || "";

  // Feed Images


  return (
    <ReduxProvider>
      <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
        {/* Top Header */}

        {/* Hero Section */}
        <section className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[560px] flex items-center justify-center overflow-hidden rounded-b-3xl shadow-2xl">
          <HeroCarousel images={heroImages} />
        </section>

        {/* Sparkle Seeker Banner */}
        <SparkleSeekerBanner config={homeData?.sparkleSeekerConfig} />



        {/* Tradition Reimagined Section */}
        <TraditionModernSection
          config={homeData?.traditionalSectionConfig}
          modernConfig={homeData?.modernSectionConfig}
        />

        {/* Jewellery Flair Section
        <section className="bg-white py-16 px-4 md:px-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {flairImages.map((section: any, index: number) => (
              <Button
                key={section.id || index}
                onClick={() => setActive(index)}
                className={`text-lg font-semibold text-gray-900 bg-transparent hover:bg-transparent pb-1 ${Active === index ? "border-b-2 border-[#FADDA0]" : ""
                  }`}
              >
                {section.name}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
            <div className="relative w-full h-auto rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
              {flairImages[Active] && (
                <Image
                  src={flairImages[Active].image || "/placeholder.jpg"}
                  alt="Section Banner"
                  width={320}
                  height={320}
                  className="object-cover w-full h-full rounded-full shadow-xl"
                />
              )}
            </div>
          </div>
        </section> */}

        {/* Shop By Category */}
        <section className="bg-white py-16 px-4 md:px-8 text-center">
          <h2 className="text-5xl font-bold mb-2 text-[#0B1C39] tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>Shop By Category</h2>
          <p className="text-lg text-gray-500 mb-10 font-light tracking-wide">So that you don&apos;t run out of options to choose from!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {shopCategories.map((category: any) => (
              <Link
                href={`/category/${category.slug}`}
                key={category.id || category.name}
                className="block"
              >
                <div
                  className="bg-white rounded-2xl shadow-xl flex flex-col items-center p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-full"
                  style={{ minWidth: 240, borderRadius: '1.5rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-6">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={320}
                        height={320}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                    )}
                  </div>
                  <div className="text-3xl text-[#0B1C39] text-center" style={{ fontFamily: 'var(--font-dancing)' }}>
                    {category.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Video Section */}
        {videos && videos.length > 0 && (
          <VideoSection videos={videos} />
        )}



        {/* Collections You'll Love */}
        <section className="bg-black py-16 px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-white tracking-tight">Collections You&apos;ll Love</h2>
          <p className="text-xl text-white/80 mb-10 font-light">Let&apos;s take a glimpse at our featured collections before diving in!</p>
          <div className="max-w-4xl mx-auto">
            <CardCarousel
              images={shopCollections.map((c: any) => ({ src: c.image, alt: c.name }))}
              autoplayDelay={2000}
              showPagination={true}
              showNavigation={true}
            />
          </div>
        </section>

        {/* Gifts that speak the Occasion */}
        <section className="bg-white py-16 px-4 md:px-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 max-w-7xl mx-auto">
            {/* Left Column: Image */}
            <div className="w-full lg:w-1/2 relative min-h-[400px] lg:h-[600px] flex items-center justify-center">
              <Image
                src="/images/image copy.png"
                alt="Gifts Stack"
                width={600}
                height={600}
                className="object-contain w-full h-auto max-h-[600px]"
              />
            </div>

            {/* Right Column: Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-center"> {/* Keep center alignment as per reference image usually, or allow left based on preference. Reference image 2 usually has center aligned icons. Let's keep text center for now or adjust. Actually prompting says 'like second image'. Use text-center for grid items. */}
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
                Gifts that speak the Occasion
              </h2>
              <p className="text-gray-500 mb-12 text-lg">
                Not seeing your moment here? Don&apos;t worry, there&apos;s a gift
                for that too.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 mb-12">
                {giftItems.map((item: any) => {
                  const iconMap: any = {
                    Cake,
                    Calendar,
                    Star,
                    Gift,
                    Baby,
                    Sparkles
                  };
                  const IconComponent = (typeof item.icon === 'string' ? iconMap[item.icon] : item.icon) || Gift;

                  return (
                    <div
                      key={item.id || item.name}
                      className="flex flex-col items-center text-center group cursor-pointer"
                    >
                      <IconComponent className="w-10 h-10 text-gray-900 mb-4 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                      <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-xs px-2">{item.desc || item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 px-10 py-6 rounded-full text-lg font-bold tracking-wide shadow-lg hover:shadow-xl transition-all">
                  FIND IT HERE!
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-gray-900 text-white py-8 px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-7xl mx-auto text-center">
            {[
              { icon: CheckCircle, text: "Certified Jewellery" },
              { icon: RefreshCcw, text: "Lifetime Exchange" },
              { icon: Star, text: "100% Refund*" },
              { icon: Truck, text: "International Shipping" },
              { icon: ShieldCheck, text: "Trust of Kalyan Jewellers" },
              { icon: CalendarDays, text: "DGRP" },
              { icon: Clock, text: "15 Day Return" },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center p-2">
                <item.icon className="w-8 h-8 text-white mb-2" />
                <span className="text-xs font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Discover In-Person Section */}
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
          <Image
            src={storeSectionBg}
            alt="Jewelry store interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-gray-900 bg-opacity-90 p-8 rounded-lg shadow-xl text-white text-center max-w-xl w-full">
              <h2 className="text-3xl font-bold mb-6">
                Discover the magic In-Person!
              </h2>
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold flex-grow">
                  DISCOVER NOW!
                </Button>
                <Dialog open={appointmentOpen} onOpenChange={setAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold flex-grow">
                      BOOK AN APPOINTMENT
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] text-black">
                    <DialogHeader>
                      <DialogTitle>Book an Appointment</DialogTitle>
                      <DialogDescription>
                        Schedule a visit to our showroom. We'll confirm your appointment via phone/email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your full name" value={bookingData.name} onChange={handleBookingChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" placeholder="+91 9876543210" type="tel" value={bookingData.phone} onChange={handleBookingChange} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email (Optional)</Label>
                          <Input id="email" placeholder="you@example.com" type="email" value={bookingData.email} onChange={handleBookingChange} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" type="date" value={bookingData.date} onChange={handleBookingChange} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="time">Time</Label>
                          <Input id="time" type="time" value={bookingData.time} onChange={handleBookingChange} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea id="message" placeholder="Any specific jewelry you are interested in?" value={bookingData.message} onChange={handleBookingChange} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleBookingSubmit}>Confirm Booking</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex justify-center gap-6">
                <Link href="#" className="text-white hover:text-gray-300">
                  <Instagram className="w-8 h-8" />
                </Link>
                <Link href="#" className="text-white hover:text-gray-300">
                  <Facebook className="w-8 h-8" />
                </Link>
                <Link href="#" className="text-white hover:text-gray-300">
                  <Youtube className="w-8 h-8" />
                </Link>
                <Link href="#" className="text-white hover:text-gray-300">
                  <Twitter className="w-8 h-8" />
                </Link>
                <Link href="#" className="text-white hover:text-gray-300">
                  <Linkedin className="w-8 h-8" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Classy Solitaires Banner */}
        <section className="relative w-full h-[400px] bg-gradient-to-r from-[#003366] to-[#006699] flex items-center justify-center overflow-hidden">
          <HeroCarousel images={secondaryImages} />
        </section>





        {/* <Footer/> */}
      </div>
    </ReduxProvider>
  );
}
