import React, { useEffect, useState, useRef } from "react";

interface ScrambledTextProps {
  children: string;
  className?: string;
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  delay?: number;
  onComplete?: () => void;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function ScrambledText({
  children,
  className = "",
  duration = 1.2,
  speed = 0.4,
  scrambleChars = DEFAULT_CHARS,
  delay = 0,
  onComplete,
}: ScrambledTextProps) {
  const [displayText, setDisplayText] = useState("");
  const targetText = children;
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const totalDurationMs = duration * 1000;
    const delayMs = delay * 1000;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / totalDurationMs, 1);

        // Calculate revealed character length
        const revealedCount = Math.floor(progress * targetText.length);

        let result = "";
        for (let i = 0; i < targetText.length; i++) {
          if (i < revealedCount) {
            result += targetText[i];
          } else {
            // Pick a random char for scrambling
            if (targetText[i] === " ") {
              result += " ";
            } else {
              const randChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
              result += randChar;
            }
          }
        }

        setDisplayText(result);

        if (progress < 1) {
          animRef.current = requestAnimationFrame(step);
        } else {
          setDisplayText(targetText);
          if (onComplete) onComplete();
        }
      };

      animRef.current = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetText, duration, speed, scrambleChars, delay, onComplete]);

  return <span className={className}>{displayText}</span>;
}
export default ScrambledText;
