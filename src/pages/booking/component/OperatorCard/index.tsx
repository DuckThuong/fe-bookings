import type { SeatSelectionOperator } from "@/api/dtos/bookings.dto";

export const OperatorCard = ({ operator }: { operator: SeatSelectionOperator }) => (
  <div className="extras-op-card">
    <div className="extras-op-card__header">
      <div className="extras-op-card__logo">{operator.code}</div>
      <div className="extras-op-card__info">
        <div className="extras-op-card__name">{operator.name}</div>
        <div className="extras-op-card__type">{operator.routeLabel}</div>
      </div>
      <div className="extras-op-card__rating">
        <i className="ti ti-star-filled" aria-hidden="true" />
        <span>{operator.rating}</span>
        <span className="extras-op-card__reviews">({operator.reviewCount})</span>
      </div>
    </div>
    <div className="extras-op-card__amenities">
      {operator.amenities.map((a) => (
        <div key={a.label} className="extras-amenity">
          <i className={`ti ti-${a.icon}`} aria-hidden="true" />
          <span>{a.label}</span>
        </div>
      ))}
    </div>
  </div>
);
