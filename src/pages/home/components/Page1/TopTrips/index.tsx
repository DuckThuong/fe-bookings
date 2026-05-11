import { LOGO_COLORS } from "@/common/constants/constants";
import { formatMoney } from "@/common/contexts/format";
import { seatColor } from "@/common/contexts/helper";
import { Button } from "antd";
import arrowToIcn from "@/assets/icons/arrowTo.svg";
interface HomeProps {
  data: any;
}
export const TopTrips = ({ data }: HomeProps) => {
  return (
    <section className="section trip-section">
      <div className="section__head">
        <h3 className="section__title">Chuyến xe được đặt nhiều nhất</h3>
        <a className="section__more">Xem tất cả →</a>
      </div>

      <div className="trip-grid">
        {data.map((trip: any) => (
          <div key={trip.id} className="trip-card">
            <div className="trip-card__header">
              <div className="trip-card__route">
                <span className="trip-card__city">{trip.from}</span>
                <span className="trip-card__route-arrow">
                  <img src={arrowToIcn} alt="arrow" />
                </span>
                <span className="trip-card__city">{trip.to}</span>
              </div>

              <div
                className="trip-card__logo"
                style={{
                  background: LOGO_COLORS[trip.operatorLogo] ?? "#0a0e1a",
                }}
              >
                {trip.operatorLogo}
              </div>
            </div>

            <div className="trip-card__body">
              <div className="trip-card__row">
                <span className="trip-card__detail-label">Khởi hành</span>
                <span className="trip-card__detail-val">{trip.departure}</span>
              </div>
              <div className="trip-card__row">
                <span className="trip-card__detail-label">Thời gian</span>
                <span className="trip-card__detail-val">{trip.duration}</span>
              </div>
              <div className="trip-card__row">
                <span className="trip-card__detail-label">Loại xe</span>
                <span className="trip-card__detail-val">{trip.type}</span>
              </div>
              <div className="trip-card__row">
                <span className="trip-card__detail-label">Chỗ trống</span>
                <span className={`trip-card__seats ${seatColor(trip.seats)}`}>
                  {trip.seats} chỗ còn lại
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
              <Button type="primary" size="small" className="trip-card__btn">
                Đặt ngay
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
