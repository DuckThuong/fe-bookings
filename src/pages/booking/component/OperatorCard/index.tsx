import { mockOperatorAmenities, mockBookingPageData } from "../../mocks/booking.mock.data";

export const OperatorCard = () => (
  <div className="extras-op-card">
    <div className="extras-op-card__header">
      <div className="extras-op-card__logo">
        {mockBookingPageData.trip.operatorCode}
      </div>
      <div className="extras-op-card__info">
        <div className="extras-op-card__name">
          {mockBookingPageData.trip.operatorName}
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
      {mockOperatorAmenities.map((a) => (
        <div key={a.label} className="extras-amenity">
          <i className={`ti ti-${a.icon}`} aria-hidden="true" />
          <span>{a.label}</span>
        </div>
      ))}
    </div>
  </div>
);
