import { getBooking } from "@/api/configs/bookings.config";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import NextActionsCard from "../../component/NextActionsCard";
import NotificationsCard from "../../component/NotificationsCard";
import PaymentSummary from "../../component/PaymentSummary";
import ProgressSteps from "../../component/ProgressSteps";
import SuccessHero from "../../component/SuccessHero";
import TicketCard from "../../component/TicketCard";
import type { BookingSuccessData } from "../../types/confirm.types";
import { toBookingSuccessData } from "../../utils/mapBookingSuccess";
import "./style.scss";

export const BookingSuccessPage = ({ data }: { data: BookingSuccessData }) => {
  const navigate = useNavigate();
  const bookingId = data.bookingId ?? data.trip.bookingId;

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
            text: `Mã đặt vé: ${bookingId}`,
          });
        } else {
          void navigator.clipboard?.writeText(bookingId);
          message.success("Đã sao chép mã đặt vé");
        }
        break;
      default:
        break;
    }
  };

  const phone =
    data.pageData.passenger.phone?.replace(/\s/g, "") ??
    data.pageData.user.phone ??
    "";

  return (
    <div className="booking-success-page">
      <HomeHeader />

      <ProgressSteps activeIdx={3} />

      <nav className="success-bc" aria-label="Breadcrumb">
        {data.pageData.breadcrumb.map((item, idx) => (
          <span key={item.label + idx}>
            {idx > 0 && (
              <i className="ti ti-chevron-right" aria-hidden="true" />
            )}
            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          </span>
        ))}
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Đặt vé thành công</span>
      </nav>

      <div className="success-page-body">
        <SuccessHero
          bookingId={bookingId}
          phone={phone}
          pendingApproval={data.status === "pending_approval"}
        />

        <div className="success-main-grid">
          <TicketCard data={data} seats={data.seats} />

          <div className="success-info-col">
            <PaymentSummary data={data} />
            <NotificationsCard notifications={data.notifications} />
          </div>
        </div>

        <NextActionsCard
          actions={data.nextActions}
          onAction={handleNextAction}
        />
      </div>
    </div>
  );
};

export const BookingSuccessRoute = () => {
  const location = useLocation();
  const { setLoading } = useLoading();
  const initialData = location.state?.data as BookingSuccessData | undefined;
  const bookingId = initialData?.bookingId ?? initialData?.trip?.bookingId;

  const { data: freshApi, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId!),
    enabled: Boolean(bookingId),
    staleTime: 60_000,
  });

  useEffect(() => {
    setLoading(isLoading && Boolean(bookingId));
  }, [isLoading, bookingId, setLoading]);

  const displayData = useMemo(() => {
    if (!initialData) return undefined;
    if (!freshApi) return initialData;
    return toBookingSuccessData(freshApi, initialData);
  }, [initialData, freshApi]);

  if (!initialData?.trip && !initialData?.bookingId) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  if (!displayData) {
    return (
      <div className="booking-success-page">
        <HomeHeader />
      </div>
    );
  }

  return <BookingSuccessPage data={displayData} />;
};

export default BookingSuccessRoute;
