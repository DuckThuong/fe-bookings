import type { PromoCode } from "@/common/constants/booking";
import { useState } from "react";

export const PromoSection = ({
  applied,
  onApply,
  promos,
  applying,
}: {
  applied: string | null;
  onApply: (code: string | null) => void;
  promos: PromoCode[];
  applying?: boolean;
}) => {
  const [input, setInput] = useState(applied ?? "");

  const handleApply = () => {
    const code = input.trim().toUpperCase();
    onApply(code || null);
  };

  const handleTagClick = (code: string) => {
    if (applied === code) {
      onApply(null);
      setInput("");
      return;
    }
    setInput(code);
    onApply(code);
  };

  return (
    <div className="extras-card">
      <div className="extras-card__hd">
        <i className="ti ti-tag" aria-hidden="true" />
        <span className="extras-card__title">Ma khuyen mai</span>
      </div>
      <div className="extras-promo-input-row">
        <input
          className="extras-promo-input"
          placeholder="Nhap ma giam gia..."
          maxLength={12}
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
        <button
          className="extras-promo-apply"
          onClick={handleApply}
          disabled={applying}
        >
          Ap dung
        </button>
      </div>
      <div className="extras-promo-tags">
        {promos.map((p) => (
          <div
            key={p.code}
            className={`extras-promo-tag${
              applied === p.code ? " extras-promo-tag--applied" : ""
            }`}
            onClick={() => handleTagClick(p.code)}
          >
            <i className={`ti ${p.icon}`} aria-hidden="true" />
            <div>
              <div className="extras-promo-tag__code">{p.code}</div>
              <div className="extras-promo-tag__off">{p.discount}</div>
              <div className="extras-promo-tag__desc">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
