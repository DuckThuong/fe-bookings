import "./style.scss";

import { useState, useCallback } from "react";
import { Button, Input, Select } from "antd";
import { HomeHeader } from "@/components/TopBar";
import { FEE_RATE, MAX_SEATS, UNIT_PRICE, VEHICLES } from "@/common/constants/booking";
import { formatVnd, getVehicleLayout } from "@/common/contexts/booking";
import type { VehicleConfig, VehicleType } from "@/common/types/booking";
import { BusMap } from "../component/BusMap";

type BookingPageData = {
  user: { userName: string; notifCount: number };
  breadcrumb: { label: string }[];
  trip: {
    from: string;
    to: string;
    operatorName: string;
    departTime: string;
    arriveTime: string;
    arriveNote?: string;
    date: string;
    durationLabel: string;
    unitPrice: number;
  };
  passenger: {
    fullName: string;
    phone: string;
    pickupPointDefault: string;
    dropoffPointDefault: string;
    pickupPointOptions: Array<{ value: string; label: string }>;
    dropoffPointOptions: Array<{ value: string; label: string }>;
  };
};

const BOOKING_PAGE_DATA: BookingPageData = {
  user: { userName: "Nguyễn An", notifCount: 3 },
  breadcrumb: [{ label: "Trang chủ" }, { label: "Vé xe" }, { label: "Chọn ghế" }],
  trip: {
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    operatorName: "GoRide Express",
    departTime: "06:00",
    arriveTime: "14:00",
    arriveNote: "(+1)",
    date: "11/05/2026",
    durationLabel: "~32 tiếng",
    unitPrice: UNIT_PRICE,
  },
  passenger: {
    fullName: "Nguyễn Văn An",
    phone: "098 765 4321",
    pickupPointDefault: "mydinh",
    dropoffPointDefault: "mienDong",
    pickupPointOptions: [
      { value: "mydinh", label: "Mỹ Đình" },
      { value: "giapbat", label: "Giáp Bát" },
      { value: "nuocngam", label: "Nước Ngầm" },
    ],
    dropoffPointOptions: [
      { value: "mienDong", label: "Miền Đông" },
      { value: "mienTay", label: "Miền Tây" },
      { value: "binhTrieu", label: "Bình Triệu" },
    ],
  },
};

export const SeatSelectionPage = () => {
  const [vehicleType, setVehicleType] = useState<VehicleType>("16");
  const [floor, setFloor] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const cfg = VEHICLES[vehicleType];

  const toggleSeat = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_SEATS) return prev;
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleVehicleChange = (v: VehicleType) => {
    setVehicleType(v);
    setFloor(1);
    setSelected(new Set());
  };

  const seats = [...selected];
  const subTotal = seats.length * UNIT_PRICE;
  const fee = Math.round(subTotal * FEE_RATE);
  const total = subTotal + fee;

  return (
    <div className="seat-page">
      <HomeHeader
        userName={BOOKING_PAGE_DATA.user.userName}
        notifCount={BOOKING_PAGE_DATA.user.notifCount}
      />

      {/* Breadcrumb */}
      <nav className="seat-breadcrumb" aria-label="Breadcrumb">
        {BOOKING_PAGE_DATA.breadcrumb.map((item, idx) => (
          <span key={`${item.label}-${idx}`}>
            {idx > 0 && <i className="ti ti-chevron-right" aria-hidden="true" />}
            {item.label}
          </span>
        ))}
      </nav>

      {/* Trip summary bar */}
      <div className="seat-trip-bar">
        <div className="seat-trip-bar__route">
          <span className="seat-trip-bar__city">{BOOKING_PAGE_DATA.trip.from}</span>
          <i className="ti ti-arrow-right" aria-hidden="true" />
          <span className="seat-trip-bar__city">{BOOKING_PAGE_DATA.trip.to}</span>
        </div>
        <div className="seat-trip-bar__meta">
          <span>
            <i className="ti ti-building" aria-hidden="true" />{" "}
            {BOOKING_PAGE_DATA.trip.operatorName}
          </span>
          <span>
            <i className="ti ti-clock" aria-hidden="true" />{" "}
            {BOOKING_PAGE_DATA.trip.departTime} → {BOOKING_PAGE_DATA.trip.arriveTime}{" "}
            {BOOKING_PAGE_DATA.trip.arriveNote ?? ""}
          </span>
          <span>
            <i className="ti ti-calendar" aria-hidden="true" />{" "}
            {BOOKING_PAGE_DATA.trip.date}
          </span>
          <span>
            <i className="ti ti-clock-hour-4" aria-hidden="true" />{" "}
            {BOOKING_PAGE_DATA.trip.durationLabel}
          </span>
        </div>
        <div className="seat-trip-bar__price">
          {formatVnd(BOOKING_PAGE_DATA.trip.unitPrice)} <span>/ ghế</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="seat-layout">
        {/* LEFT — map */}
        <div>
          {/* Vehicle tabs */}
          <div className="seat-vtabs">
            {(Object.entries(VEHICLES) as [VehicleType, VehicleConfig][]).map(
              ([key, v]) => (
                <Button
                  key={key}
                  className={`seat-vtab${vehicleType === key ? " seat-vtab--active" : ""}`}
                  onClick={() => handleVehicleChange(key)}
                  type="text"
                >
                  <i className={`ti ${v.icon}`} aria-hidden="true" />
                  {v.label}
                </Button>
              ),
            )}
          </div>

          {/* Map card */}
          <div className="seat-map-card">
            <div className="seat-map-card__title">{cfg.mapTitle}</div>
            <div className="seat-map-card__sub">{cfg.mapSub}</div>

            {/* Legend */}
            <div className="seat-legend">
              <div className="seat-legend__item">
                <div className="seat-legend__dot seat-legend__dot--avail" />
                Còn trống
              </div>
              <div className="seat-legend__item">
                <div className="seat-legend__dot seat-legend__dot--selected" />
                Đã chọn
              </div>
              <div className="seat-legend__item">
                <div className="seat-legend__dot seat-legend__dot--booked" />
                Đã đặt
              </div>
              <div className="seat-legend__item">
                <div className="seat-legend__dot seat-legend__dot--vip" />
                VIP
              </div>
            </div>

            {/* Floor tabs */}
            {cfg.floors > 1 && (
              <div className="seat-floor-tabs">
                {([1, 2] as const).map((f) => (
                  <Button
                    key={f}
                    className={`seat-floor-tab${floor === f ? " seat-floor-tab--active" : ""}`}
                    onClick={() => {
                      setFloor(f);
                      setSelected(new Set());
                    }}
                    type="text"
                  >
                    <i
                      className={`ti ${f === 1 ? "ti-layers-subtract" : "ti-layers"}`}
                      aria-hidden="true"
                    />
                    {f === 1 ? "Tầng dưới" : "Tầng trên"}
                  </Button>
                ))}
              </div>
            )}

            <BusMap
              layout={getVehicleLayout(vehicleType, floor, cfg)}
              selected={selected}
              isSleeper={!!cfg.isSleeper}
              onToggle={toggleSeat}
            />
          </div>
        </div>

        {/* RIGHT — summary */}
        <div>
          <div className="seat-summary">
            <div className="seat-summary__title">
              <i className="ti ti-ticket" aria-hidden="true" />
              Thông tin đặt vé
            </div>

            {/* Passenger form */}
            <div className="seat-form">
              <div className="seat-form__field">
                <label>Họ và tên</label>
                <Input
                  placeholder={BOOKING_PAGE_DATA.passenger.fullName}
                  defaultValue={BOOKING_PAGE_DATA.passenger.fullName}
                />
              </div>
              <div className="seat-form__field">
                <label>Số điện thoại</label>
                <Input
                  placeholder={BOOKING_PAGE_DATA.passenger.phone}
                  defaultValue={BOOKING_PAGE_DATA.passenger.phone}
                />
              </div>
              <div className="seat-form__row2">
                <div className="seat-form__field">
                  <label>Điểm lên xe</label>
                  <Select
                    defaultValue={BOOKING_PAGE_DATA.passenger.pickupPointDefault}
                    options={BOOKING_PAGE_DATA.passenger.pickupPointOptions}
                  />
                </div>
                <div className="seat-form__field">
                  <label>Điểm xuống xe</label>
                  <Select
                    defaultValue={BOOKING_PAGE_DATA.passenger.dropoffPointDefault}
                    options={BOOKING_PAGE_DATA.passenger.dropoffPointOptions}
                  />
                </div>
              </div>
            </div>

            {/* Selected seats */}
            <div className="seat-summary__section-label">Ghế đã chọn</div>
            <div className="seat-selected-list">
              {seats.length === 0 ? (
                <p className="seat-selected-list__empty">
                  Bạn chưa chọn ghế nào
                </p>
              ) : (
                seats.map((id) => (
                  <div key={id} className="seat-selected-list__item">
                    <div className="seat-selected-list__info">
                      <div className="seat-selected-list__badge">{id}</div>
                      <span>
                        {cfg.isSleeper ? "Giường nằm" : "Ghế ngồi"} — {id}
                      </span>
                    </div>
                    <Button
                      className="seat-selected-list__remove"
                      onClick={() => toggleSeat(id)}
                      aria-label={`Bỏ chọn ghế ${id}`}
                      type="text"
                    >
                      ×
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Price */}
            <div className="seat-price">
              <div className="seat-price__row">
                <span>Giá vé ({seats.length} ghế)</span>
                <strong>{seats.length ? formatVnd(subTotal) : "0đ"}</strong>
              </div>
              <div className="seat-price__row">
                <span>Phí dịch vụ (5%)</span>
                <strong>{seats.length ? formatVnd(fee) : "0đ"}</strong>
              </div>
              <div className="seat-price__row seat-price__row--total">
                <span>Tổng cộng</span>
                <strong>{seats.length ? formatVnd(total) : "0đ"}</strong>
              </div>
            </div>

            <Button
              type="primary"
              block
              className="seat-cta-btn"
              disabled={seats.length === 0}
              icon={<i className="ti ti-lock" aria-hidden="true" />}
            >
              Xác nhận đặt vé
            </Button>
            <p className="seat-cta-note">
              Bạn có 10 phút để hoàn tất thanh toán
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
