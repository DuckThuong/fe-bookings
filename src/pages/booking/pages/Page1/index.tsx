import "./style.scss";

import { formatVnd } from "@/common/contexts/booking";
import type { VehicleConfig, VehicleType } from "@/common/types/booking";
import { HomeHeader } from "@/components/TopBar";
import { Alert, Button, Input, Select, Spin, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";
import { BusMap } from "../../component/BusMap";
import { OperatorCard } from "../../component/OperatorCard";
import { AddonItem } from "../../component/AddonItem";
import { PromoSection } from "../../component/PromoSection";
import { PolicyCard } from "../../component/PolicyCard";
import ProgressSteps from "../../component/ProgressSteps";
import { useClientCompanyTripQuery } from "@/features/catalog/hooks/useCatalogApi";
import {
  useBookingConfigQuery,
  useCreateHoldMutation,
  useSeatMapQuery,
  useTripContextQuery,
  useValidatePromoMutation,
} from "@/features/booking/hooks/useBookingApi";
import type {
  ClientVehicleTypeDto,
  PassengerDto,
} from "@/api/dtos/client-booking.dto";
import {
  buildConfirmDataFromHold,
  inferClientVehicleType,
  mapBookingPageData,
  mapCatalogAddons,
  mapCatalogPromos,
  mapSeatMapRows,
  mapVehicleConfigs,
  toNumber,
} from "@/features/booking/utils/bookingMappers";
import { getApiErrorMessage } from "@/common/utils/apiError";

export const SeatSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const locationState = location.state as { tripId?: string } | null;
  const tripId = searchParams.get("tripId") ?? locationState?.tripId ?? "";

  const [vehicleType, setVehicleType] =
    useState<ClientVehicleTypeDto>("16");
  const [initializedTripId, setInitializedTripId] = useState("");
  const [floor, setFloor] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [addonQty, setAddonQty] = useState<Record<string, number>>({});
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [passengerDraft, setPassengerDraft] = useState<PassengerDto | null>(
    null,
  );

  const configQuery = useBookingConfigQuery();
  const tripContextQuery = useTripContextQuery({ tripId }, Boolean(tripId));
  const companyTripQuery = useClientCompanyTripQuery(tripId, Boolean(tripId));

  useEffect(() => {
    if (!companyTripQuery.data || initializedTripId === tripId) return;

    const inferred = inferClientVehicleType(
      companyTripQuery.data.vehicle?.type,
      companyTripQuery.data.vehicle?.seatCount,
    );
    setVehicleType(inferred);
    setFloor(1);
    setSelected(new Set());
    setInitializedTripId(tripId);
  }, [companyTripQuery.data, initializedTripId, tripId]);

  const seatMapQuery = useSeatMapQuery(
    { tripId, vehicleType, floor },
    Boolean(tripId && vehicleType),
  );

  const validatePromoMutation = useValidatePromoMutation();
  const createHoldMutation = useCreateHoldMutation();

  const pageData = useMemo(
    () =>
      tripContextQuery.data ? mapBookingPageData(tripContextQuery.data) : null,
    [tripContextQuery.data],
  );

  useEffect(() => {
    if (!tripContextQuery.data || passengerDraft) return;
    setPassengerDraft(tripContextQuery.data.passengerDefaults);
  }, [passengerDraft, tripContextQuery.data]);

  const catalog =
    tripContextQuery.data?.catalog ?? configQuery.data?.catalog ?? null;
  const vehicleConfigs = useMemo(
    () => mapVehicleConfigs(catalog?.vehicles),
    [catalog?.vehicles],
  );
  const addonOptions = useMemo(
    () => mapCatalogAddons(catalog?.addonServices),
    [catalog?.addonServices],
  );
  const promoOptions = useMemo(
    () => mapCatalogPromos(catalog?.promoCodes),
    [catalog?.promoCodes],
  );
  const seatRows = useMemo(
    () => mapSeatMapRows(seatMapQuery.data),
    [seatMapQuery.data],
  );

  const cfg = vehicleConfigs[vehicleType as VehicleType];
  const maxSeats = configQuery.data?.meta.maxSeatsPerBooking ?? 4;
  const unitPrice = toNumber(pageData?.trip.unitPrice);
  const seats = useMemo(() => [...selected], [selected]);

  const selectedAddonLines = useMemo(
    () =>
      addonOptions.flatMap((addon) => {
        if (addon.hasQty) {
          const qty = addonQty[addon.id] ?? 0;
          if (qty <= 0) return [];
          return [
            {
              id: addon.id,
              name: addon.name,
              price: addon.price,
              qty,
            },
          ];
        }

        if (!addons.has(addon.id)) return [];
        return [
          {
            id: addon.id,
            name: addon.name,
            price: addon.price,
          },
        ];
      }),
    [addonOptions, addonQty, addons],
  );

  const subTotal = seats.length * unitPrice;
  const addonsTotal = selectedAddonLines.reduce(
    (sum, addon) => sum + addon.price * (addon.qty ?? 1),
    0,
  );
  const fee = Math.round(subTotal * (configQuery.data?.meta.feeRate ?? 0.05));
  const total = Math.max(0, subTotal + fee + addonsTotal - promoDiscount);
  const priceKey = `${seats.join(",")}|${addonsTotal}`;

  useEffect(() => {
    if (!promoCode) return;
    setPromoCode(null);
    setPromoDiscount(0);
  }, [priceKey]);

  const toggleSeat = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else if (next.size < maxSeats) {
          next.add(id);
        }
        return next;
      });
    },
    [maxSeats],
  );

  const handleVehicleChange = (v: VehicleType) => {
    setVehicleType(v as ClientVehicleTypeDto);
    setFloor(1);
    setSelected(new Set());
  };

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const changeAddonQty = (id: string, delta: number) => {
    const addon = addonOptions.find((item) => item.id === id);
    const min = addon?.qtyMin ?? 0;
    const max = addon?.qtyMax ?? maxSeats;
    setAddonQty((current) => {
      const nextValue = Math.max(
        min,
        Math.min(max, (current[id] ?? 0) + delta),
      );
      return {
        ...current,
        [id]: nextValue,
      };
    });
  };

  const updatePassengerDraft = (next: Partial<PassengerDto>) => {
    setPassengerDraft((current) => ({
      fullName: "",
      phone: "",
      pickupPoint: "",
      dropoffPoint: "",
      ...(current ?? {}),
      ...next,
    }));
  };

  const handleApplyPromo = (code: string | null) => {
    if (!code) {
      setPromoCode(null);
      setPromoDiscount(0);
      return;
    }

    if (subTotal <= 0) {
      message.warning("Chon ghe truoc khi ap dung ma giam gia.");
      return;
    }

    validatePromoMutation.mutate(
      {
        tripId,
        promoCode: code,
        subTotal,
        addonsTotal,
      },
      {
        onSuccess: (response) => {
          if (!response.valid) {
            setPromoCode(null);
            setPromoDiscount(0);
            message.error(response.message ?? "Ma khuyen mai khong hop le.");
            return;
          }

          setPromoCode(code);
          setPromoDiscount(response.promoDiscount);
          message.success("Da ap dung ma khuyen mai.");
        },
        onError: (error) => {
          setPromoCode(null);
          setPromoDiscount(0);
          message.error(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleProceedToConfirm = () => {
    if (!tripContextQuery.data || !pageData) return;

    createHoldMutation.mutate(
      {
        tripId,
        vehicleType,
        floor,
        seatIds: seats,
        addons: selectedAddonLines,
        promoCode: promoCode ?? undefined,
        passenger: passengerDraft ?? undefined,
      },
      {
        onSuccess: (response) => {
          const data = buildConfirmDataFromHold(
            tripContextQuery.data,
            response,
          );
          navigate(
            `${ROUTER_PATH.BOOKING_INFO}?holdId=${encodeURIComponent(
              response.holdId,
            )}`,
            {
              state: { data },
            },
          );
        },
        onError: (error) => {
          message.error(getApiErrorMessage(error));
        },
      },
    );
  };

  if (!tripId) {
    return <Navigate to={ROUTER_PATH.TRIP} replace />;
  }

  const initialLoading =
    configQuery.isLoading ||
    tripContextQuery.isLoading ||
    companyTripQuery.isLoading ||
    !pageData ||
    !passengerDraft;
  const initialError =
    configQuery.error ?? tripContextQuery.error ?? companyTripQuery.error;

  if (initialLoading) {
    return (
      <div className="seat-page">
        <HomeHeader />
        <ProgressSteps activeIdx={0} />
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Spin />
        </div>
      </div>
    );
  }

  if (initialError) {
    return (
      <div className="seat-page">
        <HomeHeader />
        <ProgressSteps activeIdx={0} />
        <div style={{ padding: 24 }}>
          <Alert type="error" showIcon message={getApiErrorMessage(initialError)} />
        </div>
      </div>
    );
  }

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
          -
          <span className="seat-trip-bar__city">{pageData.trip.to}</span>
        </div>
        <div className="seat-trip-bar__meta">
          <span>
            <i className="ti ti-building" aria-hidden="true" />{" "}
            {pageData.trip.operatorName}
          </span>
          <span>
            <i className="ti ti-clock" aria-hidden="true" />{" "}
            {pageData.trip.departTime} - {pageData.trip.arriveTime}{" "}
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
          {formatVnd(unitPrice)} <span>/ ghe</span>
        </div>
      </div>

      <div className="seat-layout">
        <div>
          <div className="seat-vtabs">
            {(Object.entries(vehicleConfigs) as [VehicleType, VehicleConfig][]).map(
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

          <div className="seat-map-card">
            <div className="seat-map-card__title">{cfg.mapTitle}</div>
            <div className="seat-map-card__sub">{cfg.mapSub}</div>

            <div className="seat-legend">
              {(
                [
                  { cls: "avail", label: "Con trong" },
                  { cls: "selected", label: "Da chon" },
                  { cls: "booked", label: "Da dat" },
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
                    {f === 1 ? "Tang duoi" : "Tang tren"}
                  </Button>
                ))}
              </div>
            )}

            {seatMapQuery.isLoading || seatMapQuery.isFetching ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                <Spin />
              </div>
            ) : seatMapQuery.error ? (
              <Alert
                type="error"
                showIcon
                message={getApiErrorMessage(seatMapQuery.error)}
              />
            ) : (
              <BusMap
                layout={seatRows}
                selected={selected}
                isSleeper={!!cfg.isSleeper}
                onToggle={toggleSeat}
              />
            )}
          </div>

          <div className="seat-extras">
            <OperatorCard trip={pageData.trip} vehicleLabel={cfg.label} />

            <div className="extras-card">
              <div className="extras-card__hd">
                <i className="ti ti-sparkles" aria-hidden="true" />
                <span className="extras-card__title">Dich vu di kem</span>
                <span className="extras-card__badge">Tuy chon</span>
              </div>
              <div className="extras-addon-list">
                {addonOptions.map((addon) => (
                  <AddonItem
                    key={addon.id}
                    addon={addon}
                    selected={addons.has(addon.id)}
                    qty={addon.hasQty ? addonQty[addon.id] ?? 0 : undefined}
                    onToggle={toggleAddon}
                    onChangeQty={
                      addon.hasQty
                        ? (delta) => changeAddonQty(addon.id, delta)
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>

            <PromoSection
              applied={promoCode}
              onApply={handleApplyPromo}
              promos={promoOptions}
              applying={validatePromoMutation.isPending}
            />

            <PolicyCard />
          </div>
        </div>

        <div className="seat-summary-card">
          <div className="seat-summary">
            <div className="seat-summary__title">
              <i className="ti ti-ticket" aria-hidden="true" />
              Thong tin dat ve
            </div>

            <div className="seat-form">
              <div className="seat-form__field">
                <label>Ho va ten</label>
                <Input
                  placeholder={pageData.passenger.fullName}
                  value={passengerDraft.fullName}
                  onChange={(e) =>
                    updatePassengerDraft({ fullName: e.target.value })
                  }
                />
              </div>
              <div className="seat-form__field">
                <label>So dien thoai</label>
                <Input
                  placeholder={pageData.passenger.phone}
                  value={passengerDraft.phone}
                  onChange={(e) =>
                    updatePassengerDraft({ phone: e.target.value })
                  }
                />
              </div>
              <div className="seat-form__row2">
                <div className="seat-form__field">
                  <label>Diem len xe</label>
                  <Select
                    value={passengerDraft.pickupPoint}
                    options={pageData.passenger.pickupPointOptions}
                    style={{ width: "100%" }}
                    onChange={(pickupPoint) =>
                      updatePassengerDraft({ pickupPoint })
                    }
                  />
                </div>
                <div className="seat-form__field">
                  <label>Diem xuong xe</label>
                  <Select
                    value={passengerDraft.dropoffPoint}
                    options={pageData.passenger.dropoffPointOptions}
                    style={{ width: "100%" }}
                    onChange={(dropoffPoint) =>
                      updatePassengerDraft({ dropoffPoint })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="seat-summary__section-label">Ghe da chon</div>
            <div className="seat-selected-list">
              {seats.length === 0 ? (
                <p className="seat-selected-list__empty">
                  Ban chua chon ghe nao
                </p>
              ) : (
                seats.map((id) => (
                  <div key={id} className="seat-selected-list__item">
                    <div className="seat-selected-list__info">
                      <div className="seat-selected-list__badge">{id}</div>
                      <span>
                        {cfg.isSleeper ? "Giuong nam" : "Ghe ngoi"} - {id}
                      </span>
                    </div>
                    <Button
                      className="seat-selected-list__remove"
                      onClick={() => toggleSeat(id)}
                      aria-label={`Bo chon ghe ${id}`}
                      type="text"
                    >
                      x
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="seat-price">
              <div className="seat-price__row">
                <span>Gia ve ({seats.length} ghe)</span>
                <strong>{seats.length ? formatVnd(subTotal) : "0d"}</strong>
              </div>

              {addonsTotal > 0 && (
                <div className="seat-price__row">
                  <span>Dich vu bo sung</span>
                  <strong>{formatVnd(addonsTotal)}</strong>
                </div>
              )}

              <div className="seat-price__row">
                <span>Phi dich vu</span>
                <strong>{seats.length ? formatVnd(fee) : "0d"}</strong>
              </div>

              {promoDiscount > 0 && (
                <div className="seat-price__row seat-price__row--promo">
                  <span>Giam gia ({promoCode})</span>
                  <strong>-{formatVnd(promoDiscount)}</strong>
                </div>
              )}

              <div className="seat-price__row seat-price__row--total">
                <span>Tong cong</span>
                <strong>{seats.length ? formatVnd(total) : "0d"}</strong>
              </div>
            </div>

            <Button
              type="primary"
              block
              className="seat-cta-btn"
              disabled={seats.length === 0}
              loading={createHoldMutation.isPending}
              onClick={handleProceedToConfirm}
            >
              Xac nhan dat ve
            </Button>
            <p className="seat-cta-note">
              Ban co {Math.round((configQuery.data?.meta.holdSecondsDefault ?? 600) / 60)} phut de hoan tat thanh toan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
