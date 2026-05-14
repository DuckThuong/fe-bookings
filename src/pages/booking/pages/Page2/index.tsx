import { HomeHeader } from "@/components/TopBar";
import { Button, Input, Select } from "antd";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";
import { useState } from "react";
import ProgressSteps from "../../component/ProgressSteps";
import type { BookingConfirmData } from "../../types/confirm.types";
import "./style.scss";

export const BookingInfoPage = ({ data }: { data: BookingConfirmData }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(data.pageData.passenger.fullName);
  const [phone, setPhone] = useState(data.pageData.passenger.phone);
  const [pickupPoint, setPickupPoint] = useState(
    data.pageData.passenger.pickupPointDefault,
  );
  const [dropoffPoint, setDropoffPoint] = useState(
    data.pageData.passenger.dropoffPointDefault,
  );

  const handleContinue = () => {
    const updatedData = {
      ...data,
      pageData: {
        ...data.pageData,
        passenger: {
          ...data.pageData.passenger,
          fullName,
          phone,
          pickupPointDefault: pickupPoint,
          dropoffPointDefault: dropoffPoint,
        },
      },
    };

    navigate(ROUTER_PATH.BOOKING_CONFIRM, {
      state: { data: updatedData },
    });
  };

  const handleBack = () => {
    navigate(ROUTER_PATH.BOOKING);
  };

  return (
    <div className="booking-info-page">
      <HomeHeader
        userName={data.pageData.user.userName}
        notifCount={data.pageData.user.notifCount}
      />

      <ProgressSteps activeIdx={1} />

      {/* Breadcrumb */}
      <nav className="info-bc" aria-label="Breadcrumb">
        {data.pageData.breadcrumb.map((item, idx) => (
          <span key={item.label + idx}>
            {idx > 0 && (
              <i className="ti ti-chevron-right" aria-hidden="true" />
            )}
            {idx < data.pageData.breadcrumb.length - 1 ? (
              <a href="#">{item.label}</a>
            ) : (
              item.label
            )}
          </span>
        ))}
        {/* append current step */}
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Thông tin hành khách</span>
      </nav>

      {/* Main grid */}
      <div className="info-layout">
        {/* LEFT */}
        <div className="info-left">
          {/* Trip summary card */}
          <div className="info-trip-card">
            <div className="info-trip-card__header">
              <i className="ti ti-route" aria-hidden="true" />
              <span>Hành trình</span>
            </div>
            <div className="info-trip-card__route">
              <div className="info-trip-card__endpoint">
                <div className="info-trip-card__time">
                  {data.pageData.trip.departTime}
                </div>
                <div className="info-trip-card__city">
                  {data.pageData.trip.from}
                </div>
              </div>
              <div className="info-trip-card__journey">
                <div className="info-trip-card__duration">
                  {data.pageData.trip.durationLabel}
                </div>
                <div className="info-trip-card__line" />
              </div>
              <div className="info-trip-card__endpoint info-trip-card__endpoint--right">
                <div className="info-trip-card__time">
                  {data.pageData.trip.arriveTime}
                  {data.pageData.trip.arriveNote}
                </div>
                <div className="info-trip-card__city">
                  {data.pageData.trip.to}
                </div>
              </div>
            </div>
          </div>

          {/* Seats card */}
          <div className="info-seats-card">
            <div className="info-seats-card__header">
              <i className="ti ti-chair" aria-hidden="true" />
              <span>Ghế đã chọn</span>
            </div>
            <div className="info-seats-card__content">
              <div className="info-seats-list">
                {data.seats.map((seat) => (
                  <div key={seat.id} className="info-seat-chip">
                    {seat.id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="info-right">
          <div className="info-form-card">
            <div className="info-form-card__title">
              <i className="ti ti-user" aria-hidden="true" />
              Thông tin hành khách
            </div>

            {/* Form fields */}
            <div className="info-form">
              <div className="info-form__field">
                <label>Họ và tên</label>
                <Input
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="info-form__field">
                <label>Số điện thoại</label>
                <Input
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="info-form__row2">
                <div className="info-form__field">
                  <label>Điểm lên xe</label>
                  <Select
                    value={pickupPoint}
                    onChange={setPickupPoint}
                    options={data.pageData.passenger.pickupPointOptions}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="info-form__field">
                  <label>Điểm xuống xe</label>
                  <Select
                    value={dropoffPoint}
                    onChange={setDropoffPoint}
                    options={data.pageData.passenger.dropoffPointOptions}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

            <div className="info-form__actions">
              <Button
                type="default"
                block
                onClick={handleBack}
                className="info-btn-secondary"
              >
                ← Quay lại
              </Button>
              <Button
                type="primary"
                block
                onClick={handleContinue}
                className="info-btn-primary"
              >
                Tiếp tục →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookingInfoRoute = () => {
  const location = useLocation();
  const state = location.state as { data?: BookingConfirmData } | null;
  const data = state?.data;

  if (!data) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  return <BookingInfoPage data={data} />;
};
