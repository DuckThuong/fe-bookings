import { useSearchParams } from "react-router-dom";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { useEffect, useMemo } from "react";
import { getBooking } from "@/api/configs/bookings.config";
import { getBookingByPaymentLink, getPaymentStatus } from "@/api/configs/payment.config";
import ProgressSteps from "../booking/component/ProgressSteps";
import SuccessHero from "../booking/component/SuccessHero";
import TicketCard from "../booking/component/TicketCard";
import PaymentSummary from "../booking/component/PaymentSummary";
import NotificationsCard from "../booking/component/NotificationsCard";
import NextActionsCard from "../booking/component/NextActionsCard";
import type { BookingSuccessData } from "../booking/types/confirm.types";
import { BOOKING_NEXT_ACTIONS } from "../booking/constants/booking.constants";
import "./PaymentCancelPage.scss";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const paymentLinkId = searchParams.get("id");
  const orderCode = searchParams.get("orderCode");

  const { data: paymentStatus, isLoading: isPaymentLoading, isError: isPaymentError } = useQuery({
    queryKey: ["payment-status", paymentLinkId],
    queryFn: () => getPaymentStatus(paymentLinkId!),
    enabled: Boolean(paymentLinkId),
    retry: 1,
  });

  const { data: paymentBookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: ["booking-by-payment", paymentLinkId],
    queryFn: () => getBookingByPaymentLink(paymentLinkId!),
    enabled: Boolean(paymentLinkId) && paymentStatus?.status === "PAID",
    staleTime: 60_000,
  });

  const { data: freshBooking, isLoading: isFreshLoading } = useQuery({
    queryKey: ["booking", paymentBookingData?.bookingId],
    queryFn: () => getBooking(paymentBookingData!.bookingId),
    enabled: Boolean(paymentBookingData?.bookingId),
    staleTime: 60_000,
  });

  const isLoading = isPaymentLoading || isBookingLoading || isFreshLoading;
  const isSuccess = paymentStatus?.status === "PAID" && !isPaymentError;

  const displayData = useMemo<BookingSuccessData | null>(() => {
    if (!freshBooking || !paymentBookingData) return null;

    const passengerPhone = paymentBookingData.passengerPhone ?? "";
    const tripData = freshBooking.trip as any;

    return {
      bookingId: freshBooking.bookingId,
      status: freshBooking.status,
      trip: {
        ...tripData,
        paymentMethod: {
          label: "PayOS",
          last4: orderCode ? orderCode.slice(-4) : undefined,
        },
      },
      seats: freshBooking.seats,
      notifications: freshBooking.notifications,
      nextActions: BOOKING_NEXT_ACTIONS,
      pageData: {
        trip: {
          tripId: tripData.tripId ?? "",
          companyTripId: tripData.companyTripId ?? 0,
          from: tripData.departCity,
          to: tripData.arriveCity,
          operatorCode: "",
          operatorName: tripData.operatorName,
          departTime: tripData.departTime,
          arriveTime: tripData.arriveTime,
          date: tripData.date,
          durationLabel: tripData.durationLabel,
          unitPrice: 0,
        },
        passenger: {
          fullName: "",
          phone: passengerPhone,
          pickupPointDefault: tripData.boardAt,
          dropoffPointDefault: tripData.alightAt,
          pickupPointOptions: [],
          dropoffPointOptions: [],
        },
        user: {
          userName: "",
          notifCount: 0,
          phone: passengerPhone,
        },
        breadcrumb: [],
      },
      holdId: "",
      tripId: tripData.tripId ?? "",
      companyTripId: tripData.companyTripId ?? 0,
      vehicleType: "limousine" as const,
      floor: 1,
      addons: [],
      subTotal: freshBooking.pricing.subTotal,
      addonsTotal: freshBooking.pricing.addonsTotal,
      fee: freshBooking.pricing.fee,
      promoCode: freshBooking.pricing.promoCode ?? null,
      promoDiscount: freshBooking.pricing.promoDiscount,
      total: freshBooking.pricing.total,
    } as BookingSuccessData;
  }, [freshBooking, paymentBookingData, orderCode]);

  const handleNextAction = (prompt: string) => {
    switch (prompt) {
      case "go_home":
        navigate(ROUTER_PATH.HOME);
        break;
      case "view_history":
        navigate(ROUTER_PATH.PROFILE);
        break;
      case "download_ticket":
        message.info("Tính năng tải vé PDF đang được phát triển");
        break;
      case "share_ticket":
        if (navigator.share) {
          void navigator.share({
            title: "Vé xe của tôi",
            text: `Mã đặt vé: ${displayData?.bookingId}`,
          });
        } else {
          void navigator.clipboard?.writeText(displayData?.bookingId ?? "");
          message.success("Đã sao chép mã đặt vé");
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (!paymentLinkId) {
    return (
      <div className="booking-success-page">
        <HomeHeader />
        <ProgressSteps activeIdx={3} />
        <div className="success-page-body" style={{ textAlign: "center", padding: "40px 16px" }}>
          <h2>Không tìm thấy thông tin thanh toán</h2>
          <p>Vui lòng kiểm tra lại đường link thanh toán.</p>
          <button className="btn-primary" onClick={() => navigate(ROUTER_PATH.HOME)}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="booking-success-page">
        <HomeHeader />
        <div className="payment-result-loading">
          <Spin size="large" />
          <p>Đang kiểm tra trạng thái thanh toán...</p>
        </div>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="booking-success-page">
        <HomeHeader />
        <ProgressSteps activeIdx={3} />

        <nav className="success-bc" aria-label="Breadcrumb">
          <span>Trang chủ</span>
          <i className="ti ti-chevron-right" aria-hidden="true" />
          <span>Đặt vé</span>
          <i className="ti ti-chevron-right" aria-hidden="true" />
          <span>Thanh toán</span>
          <i className="ti ti-chevron-right" aria-hidden="true" />
          <span style={{ color: "#ef4444" }}>Thanh toán thất bại</span>
        </nav>

        <div className="success-page-body">
          <SuccessHero
            bookingId={""}
            phone={""}
            isError={true}
          />

          <NextActionsCard
            actions={BOOKING_NEXT_ACTIONS}
            onAction={handleNextAction}
          />
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="booking-success-page">
        <HomeHeader />
        <div className="payment-result-loading">
          <Spin size="large" />
          <p>Đang tải thông tin đặt vé...</p>
        </div>
      </div>
    );
  }

  const phone = displayData.pageData.passenger.phone?.replace(/\s/g, "") ?? "";

  return (
    <div className="booking-success-page">
      <HomeHeader />

      <ProgressSteps activeIdx={3} />

      <nav className="success-bc" aria-label="Breadcrumb">
        <span>Trang chủ</span>
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Đặt vé</span>
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Thanh toán</span>
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Đặt vé thành công</span>
      </nav>

      <div className="success-page-body">
        <SuccessHero
          bookingId={displayData.bookingId}
          phone={phone}
          pendingApproval={displayData.status === "pending_approval"}
        />

        <div className="success-main-grid">
          <TicketCard data={displayData} seats={displayData.seats} />

          <div className="success-info-col">
            <PaymentSummary data={displayData} />
            <NotificationsCard notifications={displayData.notifications} />
          </div>
        </div>

        <NextActionsCard
          actions={displayData.nextActions}
          onAction={handleNextAction}
        />
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
