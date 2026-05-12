import { OPERATOR_AMENITIES } from "@/common/constants/booking";
import { BOOKING_PAGE_DATA } from "../../pages/Page1";

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
