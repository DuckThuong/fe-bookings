import {
  ADDON_SERVICES,
  OPERATOR_AMENITIES,
  POLICIES,
  PROMO_CODES,
} from "@/common/constants/booking";
import { formatVnd } from "@/common/contexts/booking";
import { useState } from "react";
import { BOOKING_PAGE_DATA } from "../../pages";

export const OperatorCard = () => (
  <div className="extras-op-card">
    <div className="extras-op-card__header">
      <div className="extras-op-card__logo">
        {BOOKING_PAGE_DATA.trip.operatorCode}
      </div>
      <div className="extras-op-card__info">
        <div className="extras-op-card__name">
          {BOOKING_PAGE_DATA.trip.operatorName}
        </div>
        <div className="extras-op-card__type">
          Giường nằm VIP · Tuyến HN – TP.HCM
        </div>
      </div>
      <div className="extras-op-card__rating">
        <i className="ti ti-star-filled" aria-hidden="true" />
        <span>4.9</span>
      </div>
    </div>
    <div className="extras-op-card__amenities">
      {OPERATOR_AMENITIES.map((a) => (
        <div key={a.label} className="extras-amenity">
          <i className={`ti ti-${a.icon}`} aria-hidden="true" />
          <span>{a.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export const AddonItem = ({
  addon,
  selected,
  qty,
  onToggle,
  onChangeQty,
}: {
  addon: (typeof ADDON_SERVICES)[number];
  selected: boolean;
  qty?: number;
  onToggle: (id: string) => void;
  onChangeQty?: (delta: number) => void;
}) => (
  <div
    className={`extras-addon${
      selected || (qty ?? 0) > 0 ? " extras-addon--sel" : ""
    }`}
    onClick={() => !addon.hasQty && onToggle(addon.id)}
  >
    <div className="extras-addon__icon-wrap">
      <i className={`ti ti-${addon.icon}`} aria-hidden="true" />
    </div>
    <div className="extras-addon__body">
      <div className="extras-addon__name">{addon.name}</div>
      <div className="extras-addon__desc">{addon.desc}</div>
    </div>
    <div className="extras-addon__right">
      <div
        className={`extras-addon__price${
          addon.price === 0 ? " extras-addon__price--free" : ""
        }`}
      >
        {addon.price === 0 ? "Miễn phí" : formatVnd(addon.price)}
      </div>

      {addon.hasQty ? (
        <div className="extras-qty" onClick={(e) => e.stopPropagation()}>
          <button
            className="extras-qty__btn"
            onClick={() => onChangeQty?.(-1)}
            aria-label="Giảm"
          >
            −
          </button>
          <span className="extras-qty__num">{qty ?? 0}</span>
          <button
            className="extras-qty__btn"
            onClick={() => onChangeQty?.(1)}
            aria-label="Tăng"
          >
            +
          </button>
        </div>
      ) : (
        <div className="extras-addon__check">
          <i className="ti ti-check" aria-hidden="true" />
        </div>
      )}
    </div>
  </div>
);

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
    onApply(PROMO_CODES.find((p) => p.code === code) ? code : null);
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
        {PROMO_CODES.map((p) => (
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

// ─── PolicyCard ───────────────────────────────────────────
export const PolicyCard = () => (
  <div className="extras-card">
    <div className="extras-card__hd">
      <i className="ti ti-clipboard-list" aria-hidden="true" />
      <span className="extras-card__title">Chính sách nhà xe</span>
    </div>
    {POLICIES.map((p) => (
      <div key={p.title} className="extras-policy">
        <i className={`ti ti-${p.icon}`} aria-hidden="true" />
        <div className="extras-policy__body">
          <div className="extras-policy__title">
            {p.title}
            <span
              className={`extras-policy__tag extras-policy__tag--${p.tagVariant}`}
            >
              {p.tagLabel}
            </span>
          </div>
          <div className="extras-policy__desc">{p.desc}</div>
        </div>
      </div>
    ))}
  </div>
);
