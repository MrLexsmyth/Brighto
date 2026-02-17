"use client";

import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Anima = () => {
  return (
      <div className=" grid items-center justify-center ">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Expert Insights, Data & Trends</h1>
        <p className="text-center max-w-md">Actionable guides and analysis curated by our experienced agents to keep you ahead.</p>
        <div className="w-[330px] h-[330px] sm:w-[380px] sm:h-[380px] lg:w-[520px] lg:h-[520px]">
              <DotLottieReact
                src="/apart.json"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
               />
        </div>
      </div>
  )
}

export default Anima