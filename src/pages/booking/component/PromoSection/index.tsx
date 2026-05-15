import { mockPromoCodes } from "../../mocks/booking.mock.data";
import { useState } from "react";

export const PromoSection = ({
  applied,
  onApply,
}: {
  applied: string | null;
  onApply: (code: string | null) => void;
}) => {
  const [input, setInput] = useState(applied ?? "");

  const handleApply = () => {
    const code = input.trim().toUpperCase();
    onApply(mockPromoCodes.find((p) => p.code === code) ? code : null);
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
        <span className="extras-card__title">Mã khuyến mãi</span>
      </div>
      <div className="extras-promo-input-row">
        <input
          className="extras-promo-input"
          placeholder="Nhập mã giảm giá..."
          maxLength={12}
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
        <button className="extras-promo-apply" onClick={handleApply}>
          Áp dụng
        </button>
      </div>
      <div className="extras-promo-tags">
        {mockPromoCodes.map((p) => (
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
