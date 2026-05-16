import { formatVnd } from "@/common/contexts/booking";
import type { ConfirmedAddon } from "../../types/confirm.types";

const AddonsCard = ({
  addons,
  onEdit,
}: {
  addons: ConfirmedAddon[];
  onEdit: () => void;
}) => (
  <div className="confirm-section">
    <div className="confirm-section__hd">
      <i className="ti ti-sparkles" aria-hidden="true" />
      <span className="confirm-section__title">Dịch vụ đi kèm</span>
      <button className="confirm-section__edit" onClick={onEdit}>
        <i className="ti ti-pencil" aria-hidden="true" />
        Chỉnh sửa
      </button>
    </div>
    <div className="confirm-addon-list">
      {addons.map((a) => (
        <div key={a.id} className="confirm-addon-item">
          <div className="confirm-addon-item__icon">
            <i className={`ti ti-${a.icon}`} aria-hidden="true" />
          </div>
          <div className="confirm-addon-item__name">{a.name}</div>
          <div
            className={`confirm-addon-item__price${
              a.price === 0 ? " confirm-addon-item__price--free" : ""
            }`}
          >
            {a.price === 0 ? "Miễn phí" : formatVnd(a.price)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AddonsCard;
