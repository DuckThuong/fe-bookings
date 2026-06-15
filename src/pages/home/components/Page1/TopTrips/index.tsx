import { LOGO_COLORS } from "@/common/constants/constants";
import { formatMoney } from "@/common/contexts/format";
import { seatColor } from "@/common/contexts/helper";
import type { HomeTopTrip } from "@/common/types/home";
import type { Trip, TripAmenity, TripBadge } from "@/common/types/ticket";
import { ROUTER_PATH } from "@/routers/Route";
import { Button, Typography } from "antd";
import arrowToIcn from "@/assets/icons/arrowTo.svg";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface HomeProps {
  data: HomeTopTrip[];
}

const toTripItemShape = (trip: HomeTopTrip): Trip => {
  const seatCount = Math.max(trip.seatsLeft, 1);
  const isSleeper = /giường/i.test(trip.vehicleType);
  const isLimousine = /limousine|vip/i.test(trip.vehicleType);

  const amenities: TripAmenity[] = [
    { icon: "❄️", label: "Điều hoà" },
  ];
  if (isSleeper || isLimousine) {
    amenities.push({ icon: "📺", label: "Màn hình riêng" });
  }
  amenities.push({ icon: "💺", label: `${seatCount} chỗ` });

  const badges: TripBadge[] = [];
  if (trip.seatsLeft > 0) {
    badges.push({ type: "green", label: "✓ Còn vé" });
  } else {
    badges.push({ type: "red", label: "Hết vé" });
  }
  if (trip.seatsLeft > 0 && trip.seatsLeft <= 4) {
    badges.push({ type: "amber", label: "🔥 Sắp hết chỗ" });
  }

  return {
    id: String(trip.id),
    operator: {
      code: trip.operator.shortName,
      logoColor: trip.operator.logoColor,
      name: trip.operator.name,
      vehicleType: trip.vehicleType,
      rating: trip.operator.rating,
      reviewCount: trip.operator.reviewCount,
    },
    departure: trip.departure,
    arrival: trip.arrival,
    duration: trip.duration,
    stopLabel: "Thẳng, không dừng",
    price: trip.price,
    seatsLeft: trip.seatsLeft,
    badges,
    amenities,
  };
};

export const TopTrips = ({ data }: HomeProps) => {
  const navigate = useNavigate();

  const handleBook = (trip: HomeTopTrip) => {
    const tripForBooking = toTripItemShape(trip);
    navigate(ROUTER_PATH.BOOKING, {
      state: {
        from: trip.departure.city,
        to: trip.arrival.city,
        date: dayjs().format("DD/MM/YYYY"),
        trip: tripForBooking,
      },
    });
  };

  return (
    <section className="section trip-section">
      <div className="section__head">
        <h3 className="section__title">Chuyến xe được đặt nhiều nhất</h3>
        <Typography.Link className="section__more">Xem tất cả →</Typography.Link>
      </div>

      <div className="trip-grid">
        {data.map((trip) => {
          const logoBackground =
            LOGO_COLORS[trip.operator.shortName] ??
            trip.operator.logoColor ??
            "#0a0e1a";
          return (
            <div key={trip.id} className="trip-card">
              <div className="trip-card__header">
                <div className="trip-card__route">
                  <span className="trip-card__city">{trip.departure.city}</span>
                  <span className="trip-card__route-arrow">
                    <img src={arrowToIcn} alt="arrow" />
                  </span>
                  <span className="trip-card__city">{trip.arrival.city}</span>
                </div>

                <div
                  className="trip-card__logo"
                  style={{ background: logoBackground }}
                >
                  {trip.operator.shortName}
                </div>
              </div>

              <div className="trip-card__body">
                <div className="trip-card__row">
                  <span className="trip-card__detail-label">Khởi hành</span>
                  <span className="trip-card__detail-val">
                    {trip.departure.time}
                  </span>
                </div>
                <div className="trip-card__row">
                  <span className="trip-card__detail-label">Thời gian</span>
                  <span className="trip-card__detail-val">{trip.duration}</span>
                </div>
                <div className="trip-card__row">
                  <span className="trip-card__detail-label">Loại xe</span>
                  <span className="trip-card__detail-val">
                    {trip.vehicleType}
                  </span>
                </div>
                <div className="trip-card__row">
                  <span className="trip-card__detail-label">Chỗ trống</span>
                  <span className={`trip-card__seats ${seatColor(trip.seatsLeft)}`}>
                    {trip.seatsLeft} chỗ còn lại
                  </span>
                </div>
              </div>

              <div className="trip-card__footer">
                <div className="trip-card__price-block">
                  <span className="trip-card__price-label">Từ</span>
                  <span className="trip-card__price">
                    {formatMoney(trip.price)}
                  </span>
                </div>
                <Button
                  type="primary"
                  size="small"
                  className="trip-card__btn"
                  onClick={() => handleBook(trip)}
                >
                  Đặt ngay
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
