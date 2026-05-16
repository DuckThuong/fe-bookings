import type { BookingPageData } from "@/common/types/booking";
import { getDropoffPointLabel, getPickupPointLabel } from "../../utils/booking.utils";

const PassengerCard = ({
  passenger,
  onEdit,
}: {
  passenger: BookingPageData["passenger"];
  onEdit: () => void;
}) => (
  <div className="confirm-section">
    <div className="confirm-section__hd">
      <i className="ti ti-user-circle" aria-hidden="true" />
      <span className="confirm-section__title">Thông tin hành khách</span>
      <button className="confirm-section__edit" onClick={onEdit}>
        <i className="ti ti-pencil" aria-hidden="true" />
        Chỉnh sửa
      </button>
    </div>
    <div className="confirm-info-grid">
      {[
        { label: "Họ và tên", val: passenger.fullName },
        { label: "Số điện thoại", val: passenger.phone },
        {
          label: "Điểm lên xe",
          val: getPickupPointLabel(passenger),
        },
        {
          label: "Điểm xuống xe",
          val: getDropoffPointLabel(passenger),
        },
      ].map((item) => (
        <div key={item.label} className="confirm-info-item">
          <div className="confirm-info-item__label">{item.label}</div>
          <div className="confirm-info-item__val">{item.val}</div>
        </div>
      ))}
    </div>
  </div>
);

export default PassengerCard;
