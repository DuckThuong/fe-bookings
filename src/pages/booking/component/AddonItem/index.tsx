import type { ADDON_SERVICES } from "@/common/constants/booking";
import { formatVnd } from "@/common/contexts/booking";

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
