import { useEffect, useState } from "react";
import "./style.scss";

interface ScrollTopButtonProps {
  className?: string;
  threshold?: number;
  label?: string;
}

export const ScrollTopButton = ({
  className = "",
  threshold = 300,
  label = "Lên đầu trang",
}: ScrollTopButtonProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`scroll-top-btn ${className}`.trim()}
      aria-label={label}
    >
      {label}
    </button>
  );
};

