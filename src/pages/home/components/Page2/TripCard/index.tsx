import type { Trip, TripBadge } from "@/common/types/ticket";
import { Button, Tag } from "antd";

const BADGE_COLOR: Record<TripBadge["type"], string> = {
  green: "success",
  amber: "warning",
  blue: "processing",
  gray: "default",
  red: "error",
};

const OperatorHeader = ({ trip }: { trip: Trip }) => (
  <div className="tc-operator">
    <div
      className="tc-operator__logo"
      style={{ background: trip.operator.logoColor }}
    >
      {trip.operator.code}
    </div>

    <div className="tc-operator__info">
      <span className="tc-operator__name">{trip.operator.name}</span>
      <span className="tc-operator__type">{trip.operator.vehicleType}</span>
    </div>

    {trip.featured && <span className="tc-operator__featured">⭐ Đề xuất</span>}

    <div className="tc-operator__rating">
      ⭐ {trip.operator.rating}
      <span className="tc-operator__reviews">
        ({trip.operator.reviewCount})
      </span>
    </div>
  </div>
);

const RouteTimeline = ({ trip }: { trip: Trip }) => (
  <div className="tc-route">
    <div className="tc-route__endpoint">
      <div className="tc-route__time">{trip.departure.time}</div>
      <div className="tc-route__city">{trip.departure.city}</div>
      <div className="tc-route__station">{trip.departure.station}</div>
    </div>

    <div className="tc-route__mid">
      <div className="tc-route__duration">{trip.duration}</div>
      <div className="tc-route__line">
        <div className="tc-route__dot" />
        <div className="tc-route__dash" />
        <span className="tc-route__bus">🚌</span>
        <div className="tc-route__dash" />
        <div className="tc-route__dot" />
      </div>
      <div className="tc-route__stop">📍 {trip.stopLabel}</div>
    </div>

    {/* Arrival */}
    <div className="tc-route__endpoint tc-route__endpoint--right">
      <div className="tc-route__time">{trip.arrival.time}</div>
      <div className="tc-route__city">{trip.arrival.city}</div>
      <div className="tc-route__station">{trip.arrival.station}</div>
    </div>
  </div>
);

const PricePanel = ({ trip, onBook }: { trip: Trip; onBook: () => void }) => {
  const urgent = trip.seatsLeft <= 4;
  const badges = trip.badges ?? [];

  return (
    <div className="tc-price">
      <div className="tc-price__amount">
        {trip.price.toLocaleString("vi-VN")}đ
        <span className="tc-price__per">/ người</span>
      </div>

      <div className="tc-price__badges">
        {badges.map((b, i) => (
          <Tag key={i} color={BADGE_COLOR[b.type]} className="tc-badge">
            {b.label}
          </Tag>
        ))}
      </div>

      <div
        className={`tc-price__seats${urgent ? " tc-price__seats--urgent" : ""}`}
      >
        Còn <strong>{trip.seatsLeft} chỗ</strong> trống
      </div>

      <Button
        type={trip.featured ? "primary" : "default"}
        className={`tc-book-btn${trip.featured ? "" : " tc-book-btn--outline"}`}
        onClick={onBook}
      >
        Đặt vé
      </Button>
    </div>
  );
};

const AmenitiesRow = ({ amenities }: { amenities: Trip["amenities"] }) => (
  <div className="tc-amenities">
    {(amenities ?? []).map((a, i) => (
      <span key={i} className="tc-amenity">
        {a.icon} {a.label}
      </span>
    ))}
  </div>
);

interface TripCardProps {
  trip: Trip;
  onBook: (trip: Trip) => void;
}

export const TripCard = ({ trip, onBook }: TripCardProps) => (
  <div className={`trip-card${trip.featured ? " trip-card--featured" : ""}`}>
    <OperatorHeader trip={trip} />

    <div className="trip-card__body">
      <RouteTimeline trip={trip} />
      <PricePanel trip={trip} onBook={() => onBook(trip)} />
    </div>

    <AmenitiesRow amenities={trip.amenities} />
  </div>
);
