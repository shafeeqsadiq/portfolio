import React from "react";
import "../styles/PixelNameMark.css";

// Tiny vector bitmap alphabet. Keeping the lettering as vector pixels means
// it's sharp at any zoom level, loads instantly, and does not require a font.
const glyphs = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
};

function pixelPath(word) {
  const commands = [];
  [...word].forEach((char, charIndex) => {
    (glyphs[char] || []).forEach((line, y) => {
      [...line].forEach((pixel, x) => {
        if (pixel === "1") {
          commands.push(`M${charIndex * 6 + x} ${y}h1v1h-1z`);
        }
      });
    });
  });
  return commands.join(" ");
}

function PixelWord({ word }) {
  const width = word.length * 6 - 1;
  return (
    <svg
      className="pixel-name-mark__letters"
      viewBox={`0 0 ${width} 7`}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path d={pixelPath(word)} fill="currentColor" />
    </svg>
  );
}

export default function PixelNameMark() {
  return (
    <a className="pixel-name-mark" href="/#intro" aria-label="Shafeeq Sadiq — home">
      <span className="pixel-name-mark__strip pixel-name-mark__strip--first"><PixelWord word="SHAFEEQ" /></span>
      <span className="pixel-name-mark__strip pixel-name-mark__strip--second"><PixelWord word="SADIQ" /></span>
    </a>
  );
}
