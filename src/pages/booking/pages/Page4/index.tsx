import { HomeHeader } from "@/components/TopBar";
import ProgressSteps from "../../component/ProgressSteps";
import TicketCard from "../../component/TicketCard";
import "./style.scss";
import type { BookingSuccessData } from "../../types/confirm.types";
import SuccessHero from "../../component/SuccessHero";
import NotificationsCard from "../../component/NotificationsCard";
import PaymentSummary from "../../component/PaymentSummary";
import NextActionsCard from "../../component/NextActionsCard";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";
import {
  useBookingConfigQuery,
  useBookingResultQuery,
} from "@/features/booking/hooks/useBookingApi";
import { buildSuccessDataFromResult } from "@/features/booking/utils/bookingMappers";
import { Alert, Spin } from "antd";
import { getApiErrorMessage } from "@/common/utils/apiError";

export const BookingSuccessPage = ({ data }: { data: BookingSuccessData }) => {
  const navigate = useNavigate();
  const handleNextAction = (prompt: string) => {
    if (prompt === "go_home") {
      navigate(ROUTER_PATH.HOME);
      return;
    }

    if (prompt === "view_history") {
      navigate(ROUTER_PATH.PROFILE, { state: { tab: "trips" } });
      return;
    }
  };

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
        <span>Dat ve thanh cong</span>
      </nav>

      <div className="success-page-body">
        <SuccessHero
          bookingId={data.trip.bookingId}
          phone={data.pageData.user.phone ?? ""}
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
  const [searchParams] = useSearchParams();
  const state = location.state as { data?: BookingSuccessData } | null;
  const stateData = state?.data;
  const bookingId = searchParams.get("bookingId") ?? stateData?.trip.bookingId ?? "";
  const configQuery = useBookingConfigQuery();
  const resultQuery = useBookingResultQuery(
    bookingId,
    Boolean(bookingId && !stateData),
  );

  if (!bookingId && !stateData) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  if (stateData) {
    return <BookingSuccessPage data={stateData} />;
  }

  if (configQuery.isLoading || resultQuery.isLoading) {
    return (
      <div className="booking-success-page">
        <HomeHeader />
        <ProgressSteps activeIdx={3} />
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Spin />
        </div>
      </div>
    );
  }

  const error = configQuery.error ?? resultQuery.error;
  if (error || !resultQuery.data) {
    return (
      <div className="booking-success-page">
        <HomeHeader />
        <ProgressSteps activeIdx={3} />
        <div style={{ padding: 24 }}>
          <Alert type="error" showIcon message={getApiErrorMessage(error)} />
        </div>
      </div>
    );
  }

  return (
    <BookingSuccessPage
      data={buildSuccessDataFromResult(resultQuery.data, configQuery.data)}
    />
  );
};

export default BookingSuccessRoute;
