"use client"

import React from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/navigation"

import {
  Autoplay,
  Navigation,
} from "swiper/modules"

interface HeroCarouselProps {
  images: { src: string; alt: string }[]
  autoplayDelay?: number
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  images,
  autoplayDelay = 3000,
}) => {
  return (
    <div className="w-full h-full">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            <div className="relative w-full h-full">
              <Image
                src={image.src || "/placeholder.jpg"}
                alt={image.alt || "Hero Banner"}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
