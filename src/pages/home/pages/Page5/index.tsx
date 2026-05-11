import { HomeHeader } from "@/components/TopBar";
import type { Trip } from "@/common/types/ticket";
import { ROUTER_PATH } from "@/routers/Route";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";

interface BookingState {
  from?: string;
  to?: string;
  date?: string;
  trip?: Trip;
}

const FAKE_USER = {
  userName: "Nguyễn Văn A",
  notifCount: 3,
};

export const BookingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingState = (state as BookingState | null) ?? {};

  const from = bookingState.trip?.departure.city ?? bookingState.from ?? "Hà Nội";
  const to = bookingState.trip?.arrival.city ?? bookingState.to ?? "TP. Hồ Chí Minh";
  const date = bookingState.date ?? "Hôm nay";
  const selectedTrip = bookingState.trip;

  return (
    <div className="booking-detail-page">
      <HomeHeader
        userName={FAKE_USER.userName}
        notifCount={FAKE_USER.notifCount}
      />

      <main className="booking-detail-main">
        <section className="booking-detail-hero">
          <p className="booking-detail-hero__eyebrow">Xác nhận đặt vé</p>
          <h1 className="booking-detail-hero__title">
            {from} → {to}
          </h1>
          <p className="booking-detail-hero__sub">Ngày đi: {date}</p>
        </section>

        <section className="booking-detail-grid">
          <article className="booking-detail-card">
            <h2 className="booking-detail-card__title">Thông tin chuyến</h2>
            {selectedTrip ? (
              <div className="booking-info-list">
                <p>
                  <strong>Nhà xe:</strong> {selectedTrip.operator.name}
                </p>
                <p>
                  <strong>Giờ khởi hành:</strong> {selectedTrip.departure.time}
                </p>
                <p>
                  <strong>Giờ đến:</strong> {selectedTrip.arrival.time}
                </p>
                <p>
                  <strong>Loại xe:</strong> {selectedTrip.operator.vehicleType}
                </p>
                <p>
                  <strong>Giá vé:</strong>{" "}
                  {selectedTrip.price.toLocaleString("vi-VN")}đ / người
                </p>
              </div>
            ) : (
              <p className="booking-detail-card__placeholder">
                Chưa chọn chuyến cụ thể. Vui lòng quay lại danh sách chuyến để chọn
                chuyến phù hợp.
              </p>
            )}
          </article>

          <article className="booking-detail-card">
            <h2 className="booking-detail-card__title">Hành động</h2>
            <div className="booking-action-list">
              <Button
                className="booking-action-btn booking-action-btn--primary"
                type="primary"
              >
                Xác nhận đặt vé
              </Button>
              <Button
                className="booking-action-btn booking-action-btn--ghost"
                onClick={() => navigate(ROUTER_PATH.TRIP)}
              >
                Quay lại danh sách chuyến
              </Button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

