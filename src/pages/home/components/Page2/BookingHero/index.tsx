import { Banner } from "@/pages/auth/component/Banner";

export const BookingHero = () => (
  <div className="booking-hero">
    <div className="booking-hero__animated-banner" aria-hidden="true">
      <Banner />
    </div>
    <p className="booking-hero__eyebrow">Đặt vé xe liên tỉnh</p>
    <h1 className="booking-hero__title">
      Chuyến đi mới đang
      <br />
      chờ bạn khám phá
    </h1>
    <p className="booking-hero__sub">Hơn 200 tuyến — giá tốt mỗi ngày</p>
    <div className="booking-hero__deco" aria-hidden="true">
      🚌
    </div>
  </div>
);
