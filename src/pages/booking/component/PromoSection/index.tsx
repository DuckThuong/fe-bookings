import type { PromoCode } from "@/common/constants/booking";
import { useEffect, useState } from "react";

export const PromoSection = ({
  promoCodes,
  applied,
  validating,
  onApplyCode,
}: {
  promoCodes: PromoCode[];
  applied: string | null;
  validating?: boolean;
  onApplyCode: (code: string) => void;
}) => {
  const [input, setInput] = useState(applied ?? "");

  useEffect(() => {
    setInput(applied ?? "");
  }, [applied]);

  const handleApply = () => {
    onApplyCode(input.trim().toUpperCase());
  };

  const handleTagClick = (code: string) => {
    if (applied === code) {
      onApplyCode("");
      return;
    }
    setInput(code);
    onApplyCode(code);
  };

  return (
    <div className="extras-card">
      <div className="extras-card__hd">
        <i className="ti ti-ticket" aria-hidden="true" />
        <span className="extras-card__title">Mã khuyến mãi</span>
      </div>
      <div className="extras-promo-input">
        <input
          className="extras-promo-input__field"
          placeholder="Nhập mã khuyến mãi"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApply();
          }}
        />
        <button
          type="button"
          className="extras-promo-input__btn"
          onClick={handleApply}
          disabled={validating}
        >
          {validating ? "Đang kiểm tra..." : "Áp dụng"}
        </button>
      </div>
      <div className="extras-promo-tags">
        {promoCodes.map((p) => (
          <button
            key={p.code}
            type="button"
            className={`extras-promo-tag${applied === p.code ? " extras-promo-tag--active" : ""}`}
            onClick={() => handleTagClick(p.code)}
            disabled={validating}
          >
            <i className={`ti ${p.icon}`} aria-hidden="true" />
            <span className="extras-promo-tag__code">{p.code}</span>
            <span className="extras-promo-tag__desc">{p.discount}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
