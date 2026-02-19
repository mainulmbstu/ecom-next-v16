"use client";

import React, { useEffect, useState } from "react";

import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
//========================================
const Carousel = ({ slides, autoPlay = false, interval = 3000 }) => {
  const [curr, setCurr] = useState(0);
  let prevSlide = () => {
    setCurr(curr === 0 ? slides.length - 1 : curr - 1);
  };
  let nextSlide = () => {
    setCurr(curr === slides.length - 1 ? 0 : curr + 1);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className=" overflow-hidden relative">
        <div
          className=" w-full flex transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <img
              className=" w-lg-full"
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <div className=" absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={prevSlide}
            className=" p-2 bg-white rounded-full hover:bg-gray-200 transition-all cursor-pointer"
          >
            <FaChevronLeft size={40} />
          </button>
          <button
            onClick={nextSlide}
            className=" p-2 bg-white rounded-full hover:bg-gray-200 transition-all cursor-pointer"
          >
            <FaChevronRight size={40} />
          </button>
        </div>
        <div className=" absolute bottom-4 left-0 right-0">
          <div className=" flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={` transition-all w-3 h-3 p-2 rounded-full ${curr === index ? "bg-blue-500" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
