import { CheckCircleFilled, ClockCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ProfileBooking, ProfileBookingStatus } from "../../utils/mapProfileBooking";

type TicketStatusTrackerProps = {
  booking: ProfileBooking;
};

type TrackerStep = {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const APPROVED_STATUSES: ProfileBookingStatus[] = ["Đã xác nhận", "Chờ khởi hành"];

const STEPS_BY_STATUS: Record<ProfileBookingStatus, TrackerStep[]> = {
  "Đã xác nhận": [
    {
      key: "approved",
      label: "Nhà xe đã duyệt vé",
      description: "Đơn đặt vé đã được nhà xe xác nhận thành công.",
      icon: <CheckCircleFilled />,
    },
    {
      key: "preparing",
      label: "Chuẩn bị khởi hành",
      description: "Hệ thống đang sắp xếp lịch trình và phương tiện.",
      icon: <ReloadOutlined spin />,
    },
    {
      key: "departure",
      label: "Đến giờ khởi hành",
      description: "Có mặt tại điểm hẹn trước 15 phút để lên xe.",
      icon: <ClockCircleOutlined />,
    },
  ],
  "Chờ khởi hành": [
    {
      key: "approved",
      label: "Nhà xe đã duyệt vé",
      description: "Đơn đặt vé đã được nhà xe xác nhận thành công.",
      icon: <CheckCircleFilled />,
    },
    {
      key: "preparing",
      label: "Chuẩn bị khởi hành",
      description: "Phương tiện đã sẵn sàng tại điểm xuất phát.",
      icon: <CheckCircleFilled />,
    },
    {
      key: "departure",
      label: "Sẵn sàng khởi hành",
      description: "Chuyến xe sắp lăn bánh. Theo dõi cập nhật realtime.",
      icon: <ClockCircleOutlined />,
    },
  ],
  "Chờ xác nhận": [],
  "Chưa thanh toán": [],
  "Đã hủy": [],
};

const ACTIVE_STEP_INDEX: Record<ProfileBookingStatus, number> = {
  "Đã xác nhận": 1,
  "Chờ khởi hành": 2,
  "Chờ xác nhận": 0,
  "Chưa thanh toán": 0,
  "Đã hủy": 0,
};

export const TicketStatusTracker = ({ booking }: TicketStatusTrackerProps) => {
  if (!APPROVED_STATUSES.includes(booking.status)) {
    return null;
  }

  const steps = STEPS_BY_STATUS[booking.status];
  const activeIndex = ACTIVE_STEP_INDEX[booking.status];
  const isReady = booking.status === "Chờ khởi hành";
  const completedCount = activeIndex;

  return (
    <div className="pt-tracker">
      <div className="pt-tracker__head">
        <div className="pt-tracker__head-text">
          <span className="pt-tracker__eyebrow">Theo dõi tình trạng vé</span>
          <h4 className="pt-tracker__title">
            {isReady ? "Sẵn sàng khởi hành" : "Vé đã được duyệt"}
          </h4>
          <p className="pt-tracker__sub">
            Cập nhật lần cuối: vừa xong · {completedCount}/{steps.length} bước hoàn thành
          </p>
        </div>
        <div className="pt-tracker__progress-ring">
          <svg viewBox="0 0 36 36" className="pt-tracker__ring">
            <circle
              className="pt-tracker__ring-bg"
              cx="18"
              cy="18"
              r="15.9"
            />
            <circle
              className="pt-tracker__ring-fg"
              cx="18"
              cy="18"
              r="15.9"
              strokeDasharray={`${(completedCount / steps.length) * 100}, 100`}
            />
          </svg>
          <span className="pt-tracker__ring-value">
            {Math.round((completedCount / steps.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="pt-tracker__timeline">
        {steps.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          const isLast = index === steps.length - 1;
          const stateClass = isDone
            ? "pt-tracker__step--done"
            : isActive
              ? "pt-tracker__step--active"
              : "pt-tracker__step--pending";

          return (
            <div key={step.key} className={`pt-tracker__step ${stateClass}`}>
              <div className="pt-tracker__indicator">
                <div className="pt-tracker__dot">{step.icon}</div>
                {isLast ? null : (
                  <div
                    className={`pt-tracker__line ${
                      isDone ? "pt-tracker__line--done" : ""
                    }`}
                  />
                )}
              </div>

              <div className="pt-tracker__body">
                <div className="pt-tracker__label-row">
                  <span className="pt-tracker__label">{step.label}</span>
                  {isActive ? (
                    <span className="pt-tracker__badge">Đang diễn ra</span>
                  ) : isDone ? (
                    <span className="pt-tracker__badge pt-tracker__badge--done">
                      Hoàn thành
                    </span>
                  ) : null}
                </div>
                <p className="pt-tracker__desc">{step.description}</p>
                {isActive ? (
                  <div className="pt-tracker__pulse">
                    <span className="pt-tracker__pulse-dot" />
                    Đang xử lý
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-tracker__actions">
        <button type="button" className="pt-tracker__btn pt-tracker__btn--ghost">
          Xem chi tiết chuyến
        </button>
        <button type="button" className="pt-tracker__btn pt-tracker__btn--solid">
          Liên hệ nhà xe
        </button>
      </div>
    </div>
  );
};
