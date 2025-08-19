
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import React from 'react';
const SwiperBanner = () => {
    return (
        <div className="w-[77%] max-w-screen-2xl mx-auto mt-1">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000 }}
                loop={true}
                pagination={{ clickable: true }}
                className="rounded-xl overflow-hidden"
            >
                <SwiperSlide>
                    <img
                        src="/slides/slide1.jpg"
                        alt="Slide 1"
                        className="w-full object-cover"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src="/slides/slide2.jpg"
                        alt="Slide 2"
                        className="w-full object-cover"
                    />
                </SwiperSlide>
            </Swiper>
        </div>

    );
};

export default SwiperBanner;
