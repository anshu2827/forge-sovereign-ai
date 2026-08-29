import React, { useEffect, useRef, useState } from "react";

interface ScrambledTextProps {
  children: string;
  className?: string;
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
}

interface CharState {
  currentDisplay: string;
  isScrambling: boolean;
  scrambleEndTime: number;
  lastStepTime: number;
}

export function ScrambledText({
  children,
  className = "",
  radius = 100,
  duration = 2.5,
  speed = 0.15,
  scrambleChars = "xx",
}: ScrambledTextProps) {
  const text = typeof children === "string" ? children : "";
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Display character array
  const [displayChars, setDisplayChars] = useState<string[]>(() => text.split(""));

  // State refs for animation loop
  const charPosRef = useRef<{ x: number; y: number }[]>([]);
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);
  const currentPointerRef = useRef<{ x: number; y: number } | null>(null);
  
  // Track per-character scramble state
  const charStatesRef = useRef<CharState[]>([]);

  // Initialize charStatesRef
  useEffect(() => {
    charStatesRef.current = text.split("").map(() => ({
      currentDisplay: "",
      isScrambling: false,
      scrambleEndTime: 0,
      lastStepTime: 0,
    }));
  }, [text]);

  // Measure character positions in DOM
  const updateCharPositions = () => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>(".scramble-char");
    const positions: { x: number; y: number }[] = [];

    spans.forEach((span) => {
      const rect = span.getBoundingClientRect();
      positions.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    });

    charPosRef.current = positions;
  };

  useEffect(() => {
    updateCharPositions();
    window.addEventListener("resize", updateCharPositions);
    return () => window.removeEventListener("resize", updateCharPositions);
  }, [text]);

  // Smooth pointer tracking (mousemove / touchmove)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleMouseLeave = () => {
      targetPosRef.current = null;
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

  // Main animation frame loop
  useEffect(() => {
    const scrambleSet = scrambleChars.length > 0 ? scrambleChars : "xx";
    const updateIntervalMs = 140; // ~140ms between character changes for slow, intentional feel
    const durationMs = duration * 1000;
    let animFrameId: number;

    const tick = (now: number) => {
      // 1. Lerp pointer position for smooth tracking
      if (targetPosRef.current) {
        if (!currentPointerRef.current) {
          currentPointerRef.current = { ...targetPosRef.current };
        } else {
          // Smooth interpolation (lerp factor 0.1)
          currentPointerRef.current.x += (targetPosRef.current.x - currentPointerRef.current.x) * 0.1;
          currentPointerRef.current.y += (targetPosRef.current.y - currentPointerRef.current.y) * 0.1;
        }
      } else {
        currentPointerRef.current = null;
      }

      const pointer = currentPointerRef.current;
      const positions = charPosRef.current;
      const states = charStatesRef.current;
      const originalChars = text.split("");

      let hasStateChanges = false;
      const newDisplay = [...originalChars];

      originalChars.forEach((origChar, i) => {
        if (origChar === " ") {
          newDisplay[i] = " ";
          return;
        }

        const pos = positions[i];
        const state = states[i] || {
          currentDisplay: origChar,
          isScrambling: false,
          scrambleEndTime: 0,
          lastStepTime: 0,
        };

        // Calculate distance from lerped cursor to character center
        let dist = Infinity;
        if (pointer && pos) {
          const dx = pointer.x - pos.x;
          const dy = pointer.y - pos.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        // Trigger scramble if inside radius
        if (dist < radius) {
          if (!state.isScrambling || now > state.scrambleEndTime) {
            state.isScrambling = true;
            state.scrambleEndTime = now + durationMs * (0.8 + Math.random() * 0.4);
          }
        }

        // Update character display if currently scrambling
        if (state.isScrambling) {
          if (now >= state.scrambleEndTime) {
            // Finished scrambling: resolve back to clean original character
            state.isScrambling = false;
            state.currentDisplay = origChar;
          } else {
            // Controlled scramble step interval (every 140ms)
            if (now - state.lastStepTime > updateIntervalMs) {
              state.lastStepTime = now;
              // Pick random char from scrambleSet based on speed probability
              if (Math.random() < speed * 3) {
                const randIdx = Math.floor(Math.random() * scrambleSet.length);
                state.currentDisplay = scrambleSet[randIdx] || "x";
              }
            }
          }
          hasStateChanges = true;
          newDisplay[i] = state.currentDisplay || origChar;
        } else {
          newDisplay[i] = origChar;
        }
      });

      // Batch state update to React
      if (hasStateChanges || pointer) {
        setDisplayChars(newDisplay);
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [text, radius, duration, speed, scrambleChars]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="scramble-char inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {displayChars[index] ?? char}
        </span>
      ))}
    </div>
  );
}

export default ScrambledText;
