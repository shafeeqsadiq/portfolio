import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Shafeeq Sadiq's Resume",
};

export default function Resume() {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Resume</h1>
      <a
        href="https://drive.google.com/file/d/1ANTU8ELVVrqGPI_3t8P-g8bjwPi0nR_c/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
      >
        View My Resume
      </a>
    </section>
  );
}
