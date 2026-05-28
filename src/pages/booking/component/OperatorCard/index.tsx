import type { BookingPageData } from "@/common/types/booking";

const defaultAmenities = [
  { icon: "wifi", label: "Wifi" },
  { icon: "air-conditioning", label: "Dieu hoa" },
  { icon: "plug", label: "Sac USB" },
  { icon: "shield-check", label: "Bao hiem" },
];

export const OperatorCard = ({
  trip,
  vehicleLabel,
}: {
  trip: BookingPageData["trip"];
  vehicleLabel?: string;
}) => (
  <div className="extras-op-card">
    <div className="extras-op-card__header">
      <div className="extras-op-card__logo">{trip.operatorCode}</div>
      <div className="extras-op-card__info">
        <div className="extras-op-card__name">{trip.operatorName}</div>
        <div className="extras-op-card__type">
          {vehicleLabel ?? "Xe khach"} - {trip.from} - {trip.to}
        </div>
      </div>
      <div className="extras-op-card__rating">
        <i className="ti ti-star-filled" aria-hidden="true" />
        <span>4.8</span>
      </div>
    </div>
    <div className="extras-op-card__amenities">
      {defaultAmenities.map((a) => (
        <div key={a.label} className="extras-amenity">
          <i className={`ti ti-${a.icon}`} aria-hidden="true" />
          <span>{a.label}</span>
        </div>
      ))}
    </div>
  </div>
);
