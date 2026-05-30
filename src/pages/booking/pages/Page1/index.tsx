import "./style.scss";

import {
  createHold,
  getSeatSelectionPage,
  validatePromo,
} from "@/api/configs/bookings.config";
import type { CreateHoldAddonLine } from "@/api/dtos/bookings.dto";
import type { AddonService } from "@/common/constants/booking";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { formatVnd } from "@/common/contexts/booking";
import type { VehicleType } from "@/common/types/booking";
import type { Trip } from "@/common/types/ticket";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Select } from "antd";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BusMap } from "../../component/BusMap";
import { OperatorCard } from "../../component/OperatorCard";
import { AddonItem } from "../../component/AddonItem";
import { PromoSection } from "../../component/PromoSection";
import { PolicyCard } from "../../component/PolicyCard";
import ProgressSteps from "../../component/ProgressSteps";

type BookingLocationState = {
  trip?: Trip;
  date?: string;
  from?: string;
  to?: string;
};

function buildHoldAddons(
  addonServices: AddonService[],
  addons: Set<string>,
  pickupQty: number,
): CreateHoldAddonLine[] {
  return addonServices
    .filter((a) => addons.has(a.id) && (!a.hasQty || pickupQty > 0))
    .map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
      ...(a.hasQty ? { qty: pickupQty } : {}),
    }));
}

function calcAddonsTotal(
  addonServices: AddonService[],
  addons: Set<string>,
  pickupQty: number,
  pickupPrice: number,
): number {
  return (
    addonServices
      .filter((a) => !a.hasQty && addons.has(a.id))
      .reduce((s, a) => s + a.price, 0) +
    pickupQty * pickupPrice
  );
}

export const SeatSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const routeState = location.state as BookingLocationState | null;
  const tripId = routeState?.trip?.id;
  const searchDate = routeState?.date;

  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  const [vehicleType, setVehicleType] = useState<VehicleType>("16");
  const [floor, setFloor] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [pickupQty, setPickupQty] = useState(0);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [defaultsApplied, setDefaultsApplied] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["seatSelection", tripId, searchDate],
    queryFn: () => getSeatSelectionPage(tripId!, { date: searchDate }),
    enabled: Boolean(tripId),
  });

  const validatePromoMutation = useMutation({ mutationFn: validatePromo });
  const holdMutation = useMutation({ mutationFn: createHold });

  useEffect(() => {
    setLoading(
      isLoading ||
        validatePromoMutation.isPending ||
        holdMutation.isPending,
    );
  }, [
    isLoading,
    validatePromoMutation.isPending,
    holdMutation.isPending,
    setLoading,
  ]);

  useEffect(() => {
    if (!data || defaultsApplied) return;
    setVehicleType(data.defaultVehicleType);
    setFloor(data.defaultFloor === 2 ? 2 : 1);
    setDefaultsApplied(true);
  }, [data, defaultsApplied]);

  useEffect(() => {
    if (!isError) return;
    let message = DEFAULT_MESSAGE;
    if (isAxiosError(error)) {
      const apiMessage = error.response?.data?.message;
      if (typeof apiMessage === "string") message = apiMessage;
      else if (Array.isArray(apiMessage) && apiMessage[0]) message = apiMessage[0];
    }
    showNotification(message, NOTI_ERROR);
  }, [isError, error, showNotification]);

  const pageData = data?.pageData;
  const meta = data?.meta;
  const catalog = data?.catalog;
  const vehicles = data?.vehicles;
  const cfg = vehicles?.[vehicleType];
  const maxSeats = meta?.maxSeatsPerBooking ?? 4;
  const unitPrice = meta?.unitPrice ?? 0;
  const feeRate = meta?.feeRate ?? 0.05;
  const pickupPrice = meta?.pickupAddonUnitPrice ?? 50_000;
  const holdSeconds = meta?.holdSecondsDefault ?? 600;

  const addonServices: AddonService[] = catalog?.addonServices ?? [];
  const promoCodes = catalog?.promoCodes ?? [];
  const policies = catalog?.policies ?? [];

  const seatLayout = useMemo(
    () => cfg?.layouts[String(floor)] ?? [],
    [cfg, floor],
  );

  const toggleSeat = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else if (next.size < maxSeats) next.add(id);
        return next;
      });
    },
    [maxSeats],
  );

  const handleVehicleChange = (v: VehicleType) => {
    setVehicleType(v);
    setFloor(1);
    setSelected(new Set());
  };

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const changePickupQty = (d: number) =>
    setPickupQty((q) => Math.max(0, Math.min(maxSeats, q + d)));

  const handleApplyPromo = useCallback(
    async (code: string) => {
      if (!code) {
        setPromoCode(null);
        setPromoDiscount(0);
        return;
      }

      const subTotal = selected.size * unitPrice;
      const addonsTotal = calcAddonsTotal(
        addonServices,
        addons,
        pickupQty,
        pickupPrice,
      );

      try {
        const res = await validatePromoMutation.mutateAsync({
          promoCode: code,
          subTotal,
          addonsTotal,
          tripId: pageData?.trip.tripId ?? tripId,
        });

        if (res.valid) {
          setPromoCode(res.promoCode);
          setPromoDiscount(res.promoDiscount);
          showNotification("Áp dụng mã khuyến mãi thành công", NOTI_SUCCESS);
        } else {
          setPromoCode(null);
          setPromoDiscount(0);
          showNotification(
            res.message ?? "Mã khuyến mãi không hợp lệ",
            NOTI_ERROR,
          );
        }
      } catch (err) {
        setPromoCode(null);
        setPromoDiscount(0);
        let message = DEFAULT_MESSAGE;
        if (isAxiosError(err)) {
          const apiMessage = err.response?.data?.message;
          if (typeof apiMessage === "string") message = apiMessage;
          else if (Array.isArray(apiMessage) && apiMessage[0]) {
            message = apiMessage[0];
          }
        }
        showNotification(message, NOTI_ERROR);
      }
    },
    [
      selected.size,
      unitPrice,
      addonServices,
      addons,
      pickupQty,
      pickupPrice,
      pageData?.trip.tripId,
      tripId,
      validatePromoMutation,
      showNotification,
    ],
  );

  const handleProceedToConfirm = async () => {
    const seatIds = [...selected];
    if (!pageData || seatIds.length === 0) return;

    const confirmSeats = seatIds.map((id) => ({ id, label: id }));
    const confirmAddons = addonServices
      .filter(
        (addon) => addons.has(addon.id) && (!addon.hasQty || pickupQty > 0),
      )
      .map((addon) => ({
        id: addon.id,
        icon: addon.icon,
        name: addon.name,
        price: addon.hasQty ? addon.price * pickupQty : addon.price,
      }));

    try {
      const result = await holdMutation.mutateAsync({
        tripId: pageData.trip.tripId ?? tripId!,
        vehicleType,
        floor,
        seatIds,
        addons: buildHoldAddons(addonServices, addons, pickupQty),
        promoCode: promoCode ?? undefined,
        holdDurationSeconds: holdSeconds,
      });

      navigate(ROUTER_PATH.BOOKING_INFO, {
        state: {
          data: {
            pageData,
            holdId: result.holdId,
            tripId: pageData.trip.tripId,
            companyTripId: pageData.trip.companyTripId,
            vehicleType,
            floor,
            seats: confirmSeats,
            addons: confirmAddons,
            subTotal: result.pricing.subTotal,
            addonsTotal: result.pricing.addonsTotal,
            fee: result.pricing.fee,
            promoCode: result.pricing.promoCode ?? null,
            promoDiscount: result.pricing.promoDiscount,
            total: result.pricing.total,
            holdSeconds: result.holdSeconds,
          },
        },
      });
    } catch (err) {
      let message = DEFAULT_MESSAGE;
      let conflictSeats: string[] | undefined;

      if (isAxiosError(err)) {
        const body = err.response?.data as {
          message?: string | string[];
          conflictSeats?: string[];
        };
        if (typeof body?.message === "string") message = body.message;
        else if (Array.isArray(body?.message) && body.message[0]) {
          message = body.message[0];
        }
        conflictSeats = body?.conflictSeats;
      }

      showNotification(message, NOTI_ERROR);

      if (conflictSeats?.length) {
        setSelected((prev) => {
          const next = new Set(prev);
          for (const id of conflictSeats!) next.delete(id);
          return next;
        });
        void queryClient.invalidateQueries({
          queryKey: ["seatSelection", tripId, searchDate],
        });
      }
    }
  };

  if (!tripId) {
    return <Navigate to={ROUTER_PATH.TRIP} replace />;
  }

  if (!isLoading && !pageData) {
    return <Navigate to={ROUTER_PATH.TRIP} replace />;
  }

  if (!pageData || !cfg || !data) {
    return (
      <div className="seat-page">
        <HomeHeader />
      </div>
    );
  }

  const seats = [...selected];
  const subTotal = seats.length * unitPrice;
  const fee = Math.round(subTotal * feeRate);
  const addonsTotal = calcAddonsTotal(
    addonServices,
    addons,
    pickupQty,
    pickupPrice,
  );
  const total = Math.max(0, subTotal + fee + addonsTotal - promoDiscount);

  const vehicleEntries = Object.entries(vehicles ?? {}) as [
    VehicleType,
    NonNullable<typeof cfg>,
  ][];

  return (
    <div className="seat-page">
      <HomeHeader />

      <ProgressSteps activeIdx={0} />

      <nav className="seat-breadcrumb" aria-label="Breadcrumb">
        {pageData.breadcrumb.map((item, idx) => (
          <span key={`${item.label}-${idx}`}>
            {idx > 0 && (
              <span className="seat-breadcrumb__sep" aria-hidden="true">
                /
              </span>
            )}
            {idx < pageData.breadcrumb.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              item.label
            )}
          </span>
        ))}
      </nav>

      <div className="seat-trip-bar">
        <div className="seat-trip-bar__route">
          <span className="seat-trip-bar__city">{pageData.trip.from}</span>
          →
          <span className="seat-trip-bar__city">{pageData.trip.to}</span>
        </div>
        <div className="seat-trip-bar__meta">
          <span>
            <i className="ti ti-building" aria-hidden="true" />{" "}
            {pageData.trip.operatorName}
          </span>
          <span>
            <i className="ti ti-clock" aria-hidden="true" />{" "}
            {pageData.trip.departTime} → {pageData.trip.arriveTime}{" "}
            {pageData.trip.arriveNote ?? ""}
          </span>
          <span>
            <i className="ti ti-calendar" aria-hidden="true" />{" "}
            {pageData.trip.date}
          </span>
          <span>
            <i className="ti ti-clock-hour-4" aria-hidden="true" />{" "}
            {pageData.trip.durationLabel}
          </span>
        </div>
        <div className="seat-trip-bar__price">
          {formatVnd(pageData.trip.unitPrice)} <span>/ ghế</span>
        </div>
      </div>

      <div className="seat-layout">
        <div>
          <div className="seat-vtabs">
            {vehicleEntries.map(([key, v]) => (
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
            ))}
          </div>

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
              layout={seatLayout}
              selected={selected}
              isSleeper={!!cfg.isSleeper}
              onToggle={toggleSeat}
            />
          </div>

          <div className="seat-extras">
            <OperatorCard operator={data.operator} />

            <div className="extras-card">
              <div className="extras-card__hd">
                <i className="ti ti-sparkles" aria-hidden="true" />
                <span className="extras-card__title">Dịch vụ đi kèm</span>
                <span className="extras-card__badge">Tuỳ chọn</span>
              </div>
              <div className="extras-addon-list">
                {addonServices.map((addon) => (
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

            <PromoSection
              promoCodes={promoCodes}
              applied={promoCode}
              validating={validatePromoMutation.isPending}
              onApplyCode={handleApplyPromo}
            />

            <PolicyCard policies={policies} />
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
                  placeholder={pageData.passenger.fullName}
                  defaultValue={pageData.passenger.fullName}
                />
              </div>
              <div className="seat-form__field">
                <label>Số điện thoại</label>
                <Input
                  placeholder={pageData.passenger.phone}
                  defaultValue={pageData.passenger.phone}
                />
              </div>
              <div className="seat-form__row2">
                <div className="seat-form__field">
                  <label>Điểm lên xe</label>
                  <Select
                    defaultValue={pageData.passenger.pickupPointDefault}
                    options={pageData.passenger.pickupPointOptions}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="seat-form__field">
                  <label>Điểm xuống xe</label>
                  <Select
                    defaultValue={pageData.passenger.dropoffPointDefault}
                    options={pageData.passenger.dropoffPointOptions}
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
                <span>Phí dịch vụ ({Math.round(feeRate * 100)}%)</span>
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
              disabled={seats.length === 0 || holdMutation.isPending}
              onClick={() => void handleProceedToConfirm()}
            >
              {holdMutation.isPending ? "Đang giữ ghế..." : "Xác nhận đặt vé"}
            </Button>
            <p className="seat-cta-note">
              Bạn có {Math.round(holdSeconds / 60)} phút để hoàn tất thanh toán
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
