import React, { useEffect, useRef, useState, useId } from "react";

interface ScrambledTextProps {
  children: string;
  className?: string;
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
}

export function ScrambledText({
  children,
  className = "",
  radius = 100,
  speed = 0.4,
  scrambleChars = "xx",
}: ScrambledTextProps) {
  const text = typeof children === "string" ? children : "";
  const containerRef = useRef<HTMLDivElement>(null);
  const [charStates, setCharStates] = useState<string[]>(() => text.split(""));
  const charPosRef = useRef<{ x: number; y: number; original: string }[]>([]);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);

  // Measure character positions in DOM
  const updateCharPositions = () => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>(".scramble-char");
    const positions: { x: number; y: number; original: string }[] = [];

    spans.forEach((span, i) => {
      const rect = span.getBoundingClientRect();
      positions.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        original: text[i] || "",
      });
    });

    charPosRef.current = positions;
  };

  useEffect(() => {
    updateCharPositions();
    window.addEventListener("resize", updateCharPositions);
    return () => window.removeEventListener("resize", updateCharPositions);
  }, [text]);

  // Pointer position listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
      isHoveredRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        pointerPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        isHoveredRef.current = true;
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      pointerPosRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Radius-based scramble animation loop
  useEffect(() => {
    const scrambleSet = scrambleChars.length > 0 ? scrambleChars : "xx";

    const updateFrame = () => {
      const pointer = pointerPosRef.current;
      const positions = charPosRef.current;

      if (!pointer || !isHoveredRef.current || positions.length === 0) {
        // Reset back to original characters
        setCharStates((prev) => {
          if (prev.join("") === text) return prev;
          return text.split("");
        });
      } else {
        const nextStates = text.split("").map((origChar, i) => {
          if (origChar === " ") return " ";
          const pos = positions[i];
          if (!pos) return origChar;

          // Distance from cursor to character center
          const dx = pointer.x - pos.x;
          const dy = pointer.y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            // Inside radius: scramble character based on speed/probability
            if (Math.random() < speed + 0.3) {
              const randIndex = Math.floor(Math.random() * scrambleSet.length);
              return scrambleSet[randIndex] || "x";
            }
            return origChar;
          } else {
            // Outside radius: remain stable
            return origChar;
          }
        });

        setCharStates(nextStates);
      }

      animFrameRef.current = requestAnimationFrame(updateFrame);
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [text, radius, speed, scrambleChars]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="scramble-char inline-block transition-colors duration-75"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {charStates[index] ?? char}
        </span>
      ))}
    </div>
  );
}

export default ScrambledText;
