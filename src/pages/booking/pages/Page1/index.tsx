import "./style.scss";

import {
  ADDON_SERVICES,
  FEE_RATE,
  MAX_SEATS,
  PICKUP_PRICE,
  PROMO_CODES,
  UNIT_PRICE,
  VEHICLES,
} from "@/common/constants/booking";
import { formatVnd, getVehicleLayout } from "@/common/contexts/booking";
import type {
  BookingPageData,
  VehicleConfig,
  VehicleType,
} from "@/common/types/booking";
import { HomeHeader } from "@/components/TopBar";
import { Button, Input, Select } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";
import { BusMap } from "../../component/BusMap";
import { OperatorCard } from "../../component/OperatorCard";
import { AddonItem } from "../../component/AddonItem";
import { PromoSection } from "../../component/PromoSection";
import { PolicyCard } from "../../component/PolicyCard";
import ProgressSteps from "../../component/ProgressSteps";
import { mockBookingPageData } from "../../mocks/booking.mock.data";

export const BOOKING_PAGE_DATA = mockBookingPageData;

export const SeatSelectionPage = () => {
  const [vehicleType, setVehicleType] = useState<VehicleType>("16");
  const [floor, setFloor] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [pickupQty, setPickupQty] = useState(0);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  const navigate = useNavigate();
  const cfg = VEHICLES[vehicleType];

  const toggleSeat = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_SEATS) next.add(id);
      return next;
    });
  }, []);

  const handleVehicleChange = (v: VehicleType) => {
    setVehicleType(v);
    setFloor(1);
    setSelected(new Set());
  };

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const changePickupQty = (d: number) =>
    setPickupQty((q) => Math.max(0, Math.min(4, q + d)));

  const seats = [...selected];
  const subTotal = seats.length * UNIT_PRICE;
  const fee = Math.round(subTotal * FEE_RATE);

  const addonsTotal =
    ADDON_SERVICES.filter((a) => !a.hasQty && addons.has(a.id)).reduce(
      (s, a) => s + a.price,
      0,
    ) +
    pickupQty * PICKUP_PRICE;

  const promo = PROMO_CODES.find((p) => p.code === promoCode);
  const promoDiscount = promo
    ? promo.type === "fixed"
      ? promo.value
      : Math.min(
          Math.round((subTotal + addonsTotal) * promo.value),
          promo.max ?? Infinity,
        )
    : 0;

  const total = Math.max(0, subTotal + fee + addonsTotal - promoDiscount);

  const handleProceedToConfirm = () => {
    const confirmSeats = seats.map((id) => ({ id, label: id }));
    const confirmAddons = ADDON_SERVICES.filter(
      (addon) => addons.has(addon.id) && (!addon.hasQty || pickupQty > 0),
    ).map((addon) => ({
      id: addon.id,
      icon: addon.icon,
      name: addon.name,
      price: addon.hasQty ? addon.price * pickupQty : addon.price,
    }));

    navigate(ROUTER_PATH.BOOKING_INFO, {
      state: {
        data: {
          pageData: BOOKING_PAGE_DATA,
          seats: confirmSeats,
          addons: confirmAddons,
          subTotal,
          addonsTotal,
          fee,
          promoCode,
          promoDiscount,
          total,
          holdSeconds: 600,
        },
      },
    });
  };

  return (
    <div className="seat-page">
      <HomeHeader
        userName={BOOKING_PAGE_DATA.user.userName}
        notifCount={BOOKING_PAGE_DATA.user.notifCount}
      />

      <ProgressSteps activeIdx={0} />

      {/* Breadcrumb */}
      <nav className="seat-breadcrumb" aria-label="Breadcrumb">
        {BOOKING_PAGE_DATA.breadcrumb.map((item, idx) => (
          <span key={`${item.label}-${idx}`}>
            {idx > 0 && (
              <span className="seat-breadcrumb__sep" aria-hidden="true">
                /
              </span>
            )}
            {idx < BOOKING_PAGE_DATA.breadcrumb.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              item.label
            )}
          </span>
        ))}
      </nav>

      {/* Trip summary bar */}
      <div className="seat-trip-bar">
        <div className="seat-trip-bar__route">
          <span className="seat-trip-bar__city">
            {BOOKING_PAGE_DATA.trip.from}
          </span>
          →
          <span className="seat-trip-bar__city">
            {BOOKING_PAGE_DATA.trip.to}
          </span>
        </div>
        <div className="seat-trip-bar__meta">
          <span>
            <i className="ti ti-building" aria-hidden="true" />{" "}
            {BOOKING_PAGE_DATA.trip.operatorName}
          </span>
          <span>
            <i className="ti ti-clock" aria-hidden="true" />{" "}
            {BOOKING_PAGE_DATA.trip.departTime} →{" "}
            {BOOKING_PAGE_DATA.trip.arriveTime}{" "}
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

      {/* ── Main grid — layout giữ nguyên ───────────────── */}
      <div className="seat-layout">
        {/* LEFT — map + extras mới thêm */}
        <div>
          {/* Vehicle tabs */}
          <div className="seat-vtabs">
            {(Object.entries(VEHICLES) as [VehicleType, VehicleConfig][]).map(
              ([key, v]) => (
                <Button
                  key={key}
                  className={`seat-vtab${
                    vehicleType === key ? " seat-vtab--active" : ""
                  }`}
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

            <div className="seat-legend">
              {(
                [
                  { cls: "avail", label: "Còn trống" },
                  { cls: "selected", label: "Đã chọn" },
                  { cls: "booked", label: "Đã đặt" },
                  { cls: "vip", label: "VIP" },
                ] as const
              ).map((l) => (
                <div key={l.cls} className="seat-legend__item">
                  <div
                    className={`seat-legend__dot seat-legend__dot--${l.cls}`}
                  />
                  {l.label}
                </div>
              ))}
            </div>

            {cfg.floors > 1 && (
              <div className="seat-floor-tabs">
                {([1, 2] as const).map((f) => (
                  <Button
                    key={f}
                    className={`seat-floor-tab${
                      floor === f ? " seat-floor-tab--active" : ""
                    }`}
                    onClick={() => {
                      setFloor(f);
                      setSelected(new Set());
                    }}
                    type="text"
                  >
                    <i
                      className={`ti ${
                        f === 1 ? "ti-layers-subtract" : "ti-layers"
                      }`}
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

          {/* ── EXTRAS — thêm mới bên dưới map ── */}
          <div className="seat-extras">
            {/* 1. Nhà xe + tiện ích */}
            <OperatorCard />

            {/* 2. Dịch vụ đi kèm */}
            <div className="extras-card">
              <div className="extras-card__hd">
                <i className="ti ti-sparkles" aria-hidden="true" />
                <span className="extras-card__title">Dịch vụ đi kèm</span>
                <span className="extras-card__badge">Tuỳ chọn</span>
              </div>
              <div className="extras-addon-list">
                {ADDON_SERVICES.map((addon) => (
                  <AddonItem
                    key={addon.id}
                    addon={addon}
                    selected={addons.has(addon.id)}
                    qty={addon.hasQty ? pickupQty : undefined}
                    onToggle={toggleAddon}
                    onChangeQty={addon.hasQty ? changePickupQty : undefined}
                  />
                ))}
              </div>
            </div>

            <PromoSection applied={promoCode} onApply={setPromoCode} />

            <PolicyCard />
          </div>
        </div>

        <div className="seat-summary-card">
          <div className="seat-summary">
            <div className="seat-summary__title">
              <i className="ti ti-ticket" aria-hidden="true" />
              Thông tin đặt vé
            </div>

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
                    defaultValue={
                      BOOKING_PAGE_DATA.passenger.pickupPointDefault
                    }
                    options={BOOKING_PAGE_DATA.passenger.pickupPointOptions}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="seat-form__field">
                  <label>Điểm xuống xe</label>
                  <Select
                    defaultValue={
                      BOOKING_PAGE_DATA.passenger.dropoffPointDefault
                    }
                    options={BOOKING_PAGE_DATA.passenger.dropoffPointOptions}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

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

            <div className="seat-price">
              <div className="seat-price__row">
                <span>Giá vé ({seats.length} ghế)</span>
                <strong>{seats.length ? formatVnd(subTotal) : "0đ"}</strong>
              </div>

              {addonsTotal > 0 && (
                <div className="seat-price__row">
                  <span>Dịch vụ bổ sung</span>
                  <strong>{formatVnd(addonsTotal)}</strong>
                </div>
              )}

              <div className="seat-price__row">
                <span>Phí dịch vụ (5%)</span>
                <strong>{seats.length ? formatVnd(fee) : "0đ"}</strong>
              </div>

              {promoDiscount > 0 && (
                <div className="seat-price__row seat-price__row--promo">
                  <span>Giảm giá ({promoCode})</span>
                  <strong>−{formatVnd(promoDiscount)}</strong>
                </div>
              )}

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
              onClick={handleProceedToConfirm}
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
