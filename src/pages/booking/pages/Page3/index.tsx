import { confirmHoldPayment } from "@/api/configs/bookings.config";
import { formatVnd } from "@/common/contexts/booking";
import { useCountdown } from "@/common/contexts/helper";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useMutation } from "@tanstack/react-query";
import { Button } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AddonsCard from "../../component/AddonsCard";
import PassengerCard from "../../component/PassengerCard";
import PaymentSelector from "../../component/PaymentSelector";
import ProgressSteps from "../../component/ProgressSteps";
import TicketCard from "../../component/TicketCard";
import type { BookingConfirmData } from "../../types/confirm.types";
import { toBookingSuccessData } from "../../utils/mapBookingSuccess";
import "./style.scss";

export const BookingConfirmPage = ({ data }: { data: BookingConfirmData }) => {
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState("card");
  const timer = useCountdown(data.holdSeconds ?? 600);
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  const payMutation = useMutation({
    mutationFn: () =>
      confirmHoldPayment(data.holdId!, {
        paymentMethodId: payMethod,
      }),
  });

  useEffect(() => {
    setLoading(payMutation.isPending);
  }, [payMutation.isPending, setLoading]);

  const handleConfirm = async () => {
    try {
      const result = await payMutation.mutateAsync();
      const successData = toBookingSuccessData(result, data);
      showNotification("Thanh toán thành công", NOTI_SUCCESS);
      navigate(ROUTER_PATH.BOOKING_SUCCESS, {
        state: { data: successData },
      });
    } catch (err) {
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
  };

  const handleEdit = () => {
    navigate(ROUTER_PATH.BOOKING_INFO, { state: { data } });
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
              <a href="#">{item.label}</a>
            ) : (
              item.label
            )}
          </span>
        ))}
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Xác nhận đặt vé</span>
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
                Chính sách huỷ vé
              </div>
              <div className="confirm-policy-note__desc">
                Hoàn <strong>80%</strong> nếu huỷ trước 24h · Hoàn{" "}
                <strong>50%</strong> nếu huỷ trước 6h · Không hoàn nếu huỷ dưới
                6h trước giờ khởi hành.
              </div>
            </div>
          </div>
        </div>

        <div className="confirm-right">
          <div className="confirm-summary">
            <div className="confirm-summary__title">
              <i className="ti ti-receipt" aria-hidden="true" />
              Chi tiết thanh toán
            </div>

            <div className="confirm-countdown">
              <i className="ti ti-clock" aria-hidden="true" />
              <div>
                <div className="confirm-countdown__timer">{timer}</div>
                <div className="confirm-countdown__text">
                  Giữ ghế của bạn.
                  <br />
                  Hoàn tất trước khi hết giờ.
                </div>
              </div>
            </div>

            <div className="confirm-price">
              <div className="confirm-price__row">
                <span>Giá vé ({data.seats.length} ghế)</span>
                <strong>{formatVnd(data.subTotal)}</strong>
              </div>
              {data.addons.map((a) => (
                <div key={a.id} className="confirm-price__row">
                  <span>{a.name}</span>
                  <strong
                    style={a.price === 0 ? { color: "#16a34a" } : undefined}
                  >
                    {a.price === 0 ? "Miễn phí" : formatVnd(a.price)}
                  </strong>
                </div>
              ))}
              <div className="confirm-price__row">
                <span>Phí dịch vụ (5%)</span>
                <strong>{formatVnd(data.fee)}</strong>
              </div>
              {data.promoDiscount > 0 && (
                <div className="confirm-price__row confirm-price__row--promo">
                  <span>Giảm giá ({data.promoCode})</span>
                  <strong>−{formatVnd(data.promoDiscount)}</strong>
                </div>
              )}
              <div className="confirm-price__row confirm-price__row--total">
                <span>Tổng cộng</span>
                <strong>{formatVnd(data.total)}</strong>
              </div>
            </div>

            <div className="confirm-summary__sep" />

            <div className="confirm-summary__section-label">
              Phương thức thanh toán
            </div>
            <PaymentSelector selected={payMethod} onChange={setPayMethod} />

            <Button
              type="primary"
              block
              className="confirm-cta-btn"
              icon={<i className="ti ti-lock" aria-hidden="true" />}
              disabled={payMutation.isPending}
              loading={payMutation.isPending}
              onClick={() => void handleConfirm()}
            >
              Thanh toán ngay — {formatVnd(data.total)}
            </Button>
            <p className="confirm-cta-note">
              🔒 Thanh toán được bảo mật bởi SSL 256-bit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookingConfirmRoute = () => {
  const location = useLocation();
  const state = location.state as { data?: BookingConfirmData } | null;
  const data = state?.data;

  if (!data?.holdId) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  return <BookingConfirmPage data={data} />;
};
