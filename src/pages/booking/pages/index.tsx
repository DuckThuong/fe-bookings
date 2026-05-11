import "./style.scss";

import { useState, useCallback } from "react";
import { Button, Input, Select } from "antd";
import { HomeHeader } from "@/components/TopBar";
import { FEE_RATE, MAX_SEATS, UNIT_PRICE, VEHICLES } from "@/common/constants/booking";
import { formatVnd, getVehicleLayout } from "@/common/contexts/booking";
import type { VehicleConfig, VehicleType } from "@/common/types/booking";
import { BusMap } from "../component/BusMap";

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
      <HomeHeader userName="Nguyễn An" notifCount={3} />

      {/* Breadcrumb */}
      <nav className="seat-breadcrumb" aria-label="Breadcrumb">
        <span>Trang chủ</span>
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Vé xe</span>
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Chọn ghế</span>
      </nav>

      {/* Trip summary bar */}
      <div className="seat-trip-bar">
        <div className="seat-trip-bar__route">
          <span className="seat-trip-bar__city">Hà Nội</span>
          <i className="ti ti-arrow-right" aria-hidden="true" />
          <span className="seat-trip-bar__city">TP. Hồ Chí Minh</span>
        </div>
        <div className="seat-trip-bar__meta">
          <span>
            <i className="ti ti-building" aria-hidden="true" /> GoRide Express
          </span>
          <span>
            <i className="ti ti-clock" aria-hidden="true" /> 06:00 → 14:00 (+1)
          </span>
          <span>
            <i className="ti ti-calendar" aria-hidden="true" /> 11/05/2026
          </span>
          <span>
            <i className="ti ti-clock-hour-4" aria-hidden="true" /> ~32 tiếng
          </span>
        </div>
        <div className="seat-trip-bar__price">
          {formatVnd(UNIT_PRICE)} <span>/ ghế</span>
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
                  placeholder="Nguyễn Văn An"
                  defaultValue="Nguyễn Văn An"
                />
              </div>
              <div className="seat-form__field">
                <label>Số điện thoại</label>
                <Input placeholder="098 765 4321" defaultValue="098 765 4321" />
              </div>
              <div className="seat-form__row2">
                <div className="seat-form__field">
                  <label>Điểm lên xe</label>
                  <Select
                    defaultValue="mydinh"
                    options={[
                      { value: "mydinh", label: "Mỹ Đình" },
                      { value: "giapbat", label: "Giáp Bát" },
                      { value: "nuocngam", label: "Nước Ngầm" },
                    ]}
                  />
                </div>
                <div className="seat-form__field">
                  <label>Điểm xuống xe</label>
                  <Select
                    defaultValue="mienDong"
                    options={[
                      { value: "mienDong", label: "Miền Đông" },
                      { value: "mienTay", label: "Miền Tây" },
                      { value: "binhTrieu", label: "Bình Triệu" },
                    ]}
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
