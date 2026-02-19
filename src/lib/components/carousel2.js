"use client";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const Carousel2 = ({ slides, autoPlay = false, interval = 3000 }) => {
  return (
    <div className="flex justify-center">
      <div className="max-w-4xl w-full">
        <Carousel autoPlay={autoPlay} infiniteLoop interval={interval}>
          {slides.map((slide, index) => (
            <div key={index}>
              <img className=" object-contain" src={slide} />
              <p className="legend">Legend {index + 1}</p>
            </div>
          ))}
          <div className="">
            <video controls autoPlay={true} src="/00video.mp4"></video>
            <p className="legend">Legend 1</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Carousel2;
