import { formatVnd } from "@/common/contexts/booking";
import { useCountdown } from "@/common/contexts/helper";
import { HomeHeader } from "@/components/TopBar";
import { Alert, Button, Spin, message } from "antd";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";
import { useEffect, useMemo, useState } from "react";
import AddonsCard from "../../component/AddonsCard";
import PassengerCard from "../../component/PassengerCard";
import PaymentSelector from "../../component/PaymentSelector";
import ProgressSteps from "../../component/ProgressSteps";
import TicketCard from "../../component/TicketCard";
import type { BookingConfirmData } from "../../types/confirm.types";
import {
  useBookingConfigQuery,
  useBookingResultQuery,
  useConfirmHoldPaymentMutation,
} from "@/features/booking/hooks/useBookingApi";
import {
  buildConfirmDataFromResult,
  buildSuccessDataFromResult,
  mapPaymentMethods,
} from "@/features/booking/utils/bookingMappers";
import { getApiErrorMessage } from "@/common/utils/apiError";
import "./style.scss";

export const BookingConfirmPage = ({
  data,
}: {
  data: BookingConfirmData;
}) => {
  const navigate = useNavigate();
  const configQuery = useBookingConfigQuery();
  const paymentMethods = useMemo(
    () => mapPaymentMethods(configQuery.data?.catalog.paymentMethods),
    [configQuery.data?.catalog.paymentMethods],
  );
  const [payMethod, setPayMethod] = useState(
    data.paymentMethodId ?? paymentMethods[0]?.id ?? "card",
  );
  const confirmPaymentMutation = useConfirmHoldPaymentMutation();
  const timer = useCountdown(data.holdSeconds ?? 600);
  const holdId = data.holdId ?? "";

  useEffect(() => {
    if (!paymentMethods.length) return;
    if (paymentMethods.some((method) => method.id === payMethod)) return;
    setPayMethod(paymentMethods[0].id);
  }, [payMethod, paymentMethods]);

  const handleConfirm = () => {
    if (!holdId) {
      message.error("Khong tim thay ma giu cho.");
      return;
    }

    confirmPaymentMutation.mutate(
      {
        holdId,
        payload: {
          paymentMethodId: payMethod,
        },
      },
      {
        onSuccess: (response) => {
          const successData = buildSuccessDataFromResult(
            response,
            configQuery.data,
          );
          navigate(
            `${ROUTER_PATH.BOOKING_SUCCESS}?bookingId=${encodeURIComponent(
              response.bookingId,
            )}`,
            {
              state: { data: successData },
            },
          );
        },
        onError: (error) => {
          message.error(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleEdit = () => {
    navigate(`${ROUTER_PATH.BOOKING_INFO}?holdId=${encodeURIComponent(holdId)}`, {
      state: { data },
    });
  };

  return (
    <div className="booking-confirm-page">
      <HomeHeader />

      <ProgressSteps activeIdx={2} />

      <nav className="confirm-bc" aria-label="Breadcrumb">
        {data.pageData.breadcrumb.map((item, idx) => (
          <span key={item.label + idx}>
            {idx > 0 && (
              <i className="ti ti-chevron-right" aria-hidden="true" />
            )}
            {idx < data.pageData.breadcrumb.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              item.label
            )}
          </span>
        ))}
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Xac nhan dat ve</span>
      </nav>

      <div className="confirm-layout">
        <div className="confirm-left">
          <TicketCard data={data} seats={data.seats} />
          <PassengerCard
            passenger={data.pageData.passenger}
            onEdit={handleEdit}
          />
          {data.addons.length > 0 && (
            <AddonsCard addons={data.addons} onEdit={handleEdit} />
          )}

          <div className="confirm-policy-note">
            <i className="ti ti-info-circle" aria-hidden="true" />
            <div>
              <div className="confirm-policy-note__title">
                Chinh sach huy ve
              </div>
              <div className="confirm-policy-note__desc">
                Vui long hoan tat thanh toan truoc khi het thoi gian giu cho.
              </div>
            </div>
          </div>
        </div>

        <div className="confirm-right">
          <div className="confirm-summary">
            <div className="confirm-summary__title">
              <i className="ti ti-receipt" aria-hidden="true" />
              Chi tiet thanh toan
            </div>

            <div className="confirm-countdown">
              <i className="ti ti-clock" aria-hidden="true" />
              <div>
                <div className="confirm-countdown__timer">{timer}</div>
                <div className="confirm-countdown__text">
                  Giu ghe cua ban.
                  <br />
                  Hoan tat truoc khi het gio.
                </div>
              </div>
            </div>

            <div className="confirm-price">
              <div className="confirm-price__row">
                <span>Gia ve ({data.seats.length} ghe)</span>
                <strong>{formatVnd(data.subTotal)}</strong>
              </div>
              {data.addons.map((a) => (
                <div key={a.id} className="confirm-price__row">
                  <span>{a.name}</span>
                  <strong
                    style={a.price === 0 ? { color: "#16a34a" } : undefined}
                  >
                    {a.price === 0 ? "Mien phi" : formatVnd(a.price)}
                  </strong>
                </div>
              ))}
              <div className="confirm-price__row">
                <span>Phi dich vu</span>
                <strong>{formatVnd(data.fee)}</strong>
              </div>
              {data.promoDiscount > 0 && (
                <div className="confirm-price__row confirm-price__row--promo">
                  <span>Giam gia ({data.promoCode})</span>
                  <strong>-{formatVnd(data.promoDiscount)}</strong>
                </div>
              )}
              <div className="confirm-price__row confirm-price__row--total">
                <span>Tong cong</span>
                <strong>{formatVnd(data.total)}</strong>
              </div>
            </div>

            <div className="confirm-summary__sep" />

            <div className="confirm-summary__section-label">
              Phuong thuc thanh toan
            </div>
            {configQuery.isLoading ? (
              <Spin />
            ) : (
              <PaymentSelector
                selected={payMethod}
                onChange={setPayMethod}
                methods={paymentMethods}
              />
            )}

            <Button
              type="primary"
              block
              className="confirm-cta-btn"
              icon={<i className="ti ti-lock" aria-hidden="true" />}
              onClick={handleConfirm}
              loading={confirmPaymentMutation.isPending}
              disabled={!paymentMethods.length}
            >
              Thanh toan ngay - {formatVnd(data.total)}
            </Button>
            <p className="confirm-cta-note">
              Thanh toan duoc bao mat boi SSL 256-bit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookingConfirmRoute = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as { data?: BookingConfirmData } | null;
  const stateData = state?.data;
  const holdId = searchParams.get("holdId") ?? stateData?.holdId ?? "";
  const configQuery = useBookingConfigQuery();
  const resultQuery = useBookingResultQuery(holdId, Boolean(holdId && !stateData));

  if (!holdId && !stateData) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  if (stateData) {
    return <BookingConfirmPage data={stateData} />;
  }

  if (configQuery.isLoading || resultQuery.isLoading) {
    return (
      <div className="booking-confirm-page">
        <HomeHeader />
        <ProgressSteps activeIdx={2} />
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Spin />
        </div>
      </div>
    );
  }

  const error = configQuery.error ?? resultQuery.error;
  if (error || !resultQuery.data) {
    return (
      <div className="booking-confirm-page">
        <HomeHeader />
        <ProgressSteps activeIdx={2} />
        <div style={{ padding: 24 }}>
          <Alert type="error" showIcon message={getApiErrorMessage(error)} />
        </div>
      </div>
    );
  }

  return (
    <BookingConfirmPage
      data={buildConfirmDataFromResult(resultQuery.data, configQuery.data)}
    />
  );
};
