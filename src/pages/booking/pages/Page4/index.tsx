import { HomeHeader } from "@/components/TopBar";
import ProgressSteps from "../../component/ProgressSteps";
import TicketCard from "../../component/TicketCard";
import "./style.scss";
import type { BookingSuccessData } from "../../types/confirm.types";
import SuccessHero from "../../component/SuccessHero";
import NotificationsCard from "../../component/NotificationsCard";
import PaymentSummary from "../../component/PaymentSummary";
import NextActionsCard from "../../component/NextActionsCard";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";

export const BookingSuccessPage = ({ data }: { data: BookingSuccessData }) => {
  const navigate = useNavigate();
  const handleNextAction = (prompt: string) => {
    const updatedData = {
      ...data,
      pageData: {
        ...data.pageData,
        passenger: {
          ...data.pageData.passenger,
        },
      },
    };

    navigate(ROUTER_PATH.BOOKING_CONFIRM, {
      state: { data: updatedData },
    });
  };

  return (
    <div className="booking-success-page">
      <HomeHeader
        userName={data.pageData.user.userName}
        notifCount={data.pageData.user.notifCount}
      />

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
          bookingId={"8812A8192777"}
          phone={data.pageData.user.phone ?? "098 765 4321"}
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
  const data = location.state?.data as BookingSuccessData;

  if (!data) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  return <BookingSuccessPage data={data} />;
};

export default BookingSuccessRoute;
