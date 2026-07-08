import { CheckCircleFilled, ClockCircleOutlined, ReloadOutlined, CarOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import type { ProfileBooking, ProfileBookingStatus, OperationStatus } from "../../utils/mapProfileBooking";

type TicketStatusTrackerProps = {
  booking: ProfileBooking;
  onContactOperator: (operatorCode: string, operatorName: string, operatorUserId?: number) => void;
  onRequestRefund?: (bookingId: string) => void;
  refundLoading?: boolean;
};

type TrackerStep = {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const OPERATION_STATUS_CONFIG: Record<OperationStatus, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: "Đã lên lịch", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  PREPARING: { label: "Chuẩn bị khởi hành", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  BOARDING: { label: "Đang đón khách", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  DEPARTED: { label: "Đã khởi hành", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  APPROACHING: { label: "Sắp đến điểm đón", color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
  MOVING: { label: "Đang di chuyển", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  ARRIVED: { label: "Đã đến điểm đón", color: "#14b8a6", bg: "rgba(20,184,166,0.12)" },
  COMPLETED: { label: "Hoàn thành", color: "#64748b", bg: "rgba(100,116,139,0.12)" },
  CANCELLED: { label: "Đã hủy", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  DELAYED: { label: "Trễ chuyến", color: "#f97316", bg: "rgba(249,115,22,0.12)" },
};

const STATUS_ORDER: OperationStatus[] = [
  "SCHEDULED",
  "PREPARING",
  "BOARDING",
  "DEPARTED",
  "APPROACHING",
  "MOVING",
  "ARRIVED",
  "COMPLETED",
];

const STATUS_STEP_CONFIG: Record<OperationStatus, TrackerStep[]> = {
  SCHEDULED: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Hệ thống đang sắp xếp lịch trình và phương tiện.", icon: <ReloadOutlined spin /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đang đến điểm đón khách.", icon: <ClockCircleOutlined /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <CarOutlined /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường đến điểm đến.", icon: <CarOutlined /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  PREPARING: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đang đến điểm đón khách.", icon: <ClockCircleOutlined /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <CarOutlined /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường đến điểm đến.", icon: <CarOutlined /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  BOARDING: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đang đón khách tại điểm hẹn.", icon: <CheckCircleFilled /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <ClockCircleOutlined /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường đến điểm đến.", icon: <CarOutlined /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  DEPARTED: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đã đón khách xong.", icon: <CheckCircleFilled /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <CheckCircleFilled /> },
    { key: "approaching", label: "Sắp đến điểm đón", description: "Xe sắp đến điểm đón tiếp theo.", icon: <ClockCircleOutlined /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường đến điểm đến.", icon: <CarOutlined /> },
    { key: "arrived", label: "Đã đến điểm đón", description: "Xe đã đến điểm đón.", icon: <CheckCircleFilled /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  APPROACHING: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đã đón khách xong.", icon: <CheckCircleFilled /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <CheckCircleFilled /> },
    { key: "approaching", label: "Sắp đến điểm đón", description: "Xe sắp đến điểm đón của bạn.", icon: <CheckCircleFilled /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường đến điểm đến.", icon: <CarOutlined /> },
    { key: "arrived", label: "Đã đến điểm đón", description: "Xe đã đến điểm đón. Hãy chuẩn bị lên xe!", icon: <ClockCircleOutlined /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  MOVING: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đã đón khách xong.", icon: <CheckCircleFilled /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <CheckCircleFilled /> },
    { key: "approaching", label: "Sắp đến điểm đón", description: "Xe đang đến điểm đón tiếp theo.", icon: <CheckCircleFilled /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường. Cảm ơn quý khách đã đồng hành!", icon: <CheckCircleFilled /> },
    { key: "arrived", label: "Đã đến điểm đón", description: "Xe đã đến điểm đón.", icon: <CheckCircleFilled /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  ARRIVED: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đã đón khách xong.", icon: <CheckCircleFilled /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <CheckCircleFilled /> },
    { key: "approaching", label: "Sắp đến điểm đón", description: "Xe đang đến điểm đón tiếp theo.", icon: <CheckCircleFilled /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường.", icon: <CheckCircleFilled /> },
    { key: "arrived", label: "Đã đến điểm đón", description: "Xe đã đến điểm đón. Hãy chuẩn bị xuống xe!", icon: <CheckCircleFilled /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  COMPLETED: [
    { key: "scheduled", label: "Đã lên lịch", description: "Chuyến xe đã được lên lịch trình.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "boarding", label: "Đang đón khách", description: "Xe đã đón khách xong.", icon: <CheckCircleFilled /> },
    { key: "departed", label: "Đã khởi hành", description: "Xe đã rời bến và bắt đầu hành trình.", icon: <CheckCircleFilled /> },
    { key: "approaching", label: "Sắp đến điểm đón", description: "Xe đang đến điểm đón tiếp theo.", icon: <CheckCircleFilled /> },
    { key: "moving", label: "Đang di chuyển", description: "Xe đang trên đường.", icon: <CheckCircleFilled /> },
    { key: "arrived", label: "Đã đến điểm đón", description: "Xe đã đến điểm đón.", icon: <CheckCircleFilled /> },
    { key: "completed", label: "Hoàn thành", description: "Chuyến xe đã hoàn tất. Cảm ơn quý khách!", icon: <CheckCircleFilled /> },
  ],
  CANCELLED: [],
  DELAYED: [],
};

const LEGACY_STEPS_BY_STATUS: Record<ProfileBookingStatus, TrackerStep[]> = {
  "Đã xác nhận": [
    { key: "approved", label: "Nhà xe đã duyệt vé", description: "Đơn đặt vé đã được nhà xe xác nhận thành công.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Hệ thống đang sắp xếp lịch trình và phương tiện.", icon: <ReloadOutlined spin /> },
    { key: "departure", label: "Đến giờ khởi hành", description: "Có mặt tại điểm hẹn trước 15 phút để lên xe.", icon: <ClockCircleOutlined /> },
  ],
  "Chờ khởi hành": [
    { key: "approved", label: "Nhà xe đã duyệt vé", description: "Đơn đặt vé đã được nhà xe xác nhận thành công.", icon: <CheckCircleFilled /> },
    { key: "preparing", label: "Chuẩn bị khởi hành", description: "Phương tiện đã sẵn sàng tại điểm xuất phát.", icon: <CheckCircleFilled /> },
    { key: "departure", label: "Sẵn sàng khởi hành", description: "Chuyến xe sắp lăn bánh. Theo dõi cập nhật realtime.", icon: <ClockCircleOutlined /> },
  ],
  "Chờ xác nhận": [],
  "Chưa thanh toán": [],
  "Đã hủy": [],
  "Chuẩn bị khởi hành": [],
  "Đang đón khách": [],
  "Đã khởi hành": [],
  "Sắp đến điểm đón": [],
  "Đang di chuyển": [],
  "Đã đến điểm đón": [],
  "Hoàn thành": [],
  "Chờ hoàn tiền": []
};

const LEGACY_ACTIVE_INDEX: Record<ProfileBookingStatus, number> = {
  "Đã xác nhận": 1,
  "Chờ khởi hành": 2,
  "Chờ xác nhận": 0,
  "Chưa thanh toán": 0,
  "Đã hủy": 0,
  "Chuẩn bị khởi hành": 0,
  "Đang đón khách": 0,
  "Đã khởi hành": 0,
  "Sắp đến điểm đón": 0,
  "Đang di chuyển": 0,
  "Đã đến điểm đón": 0,
  "Hoàn thành": 0,
  "Chờ hoàn tiền": 0
};

const LEGACY_APPROVED_STATUSES: ProfileBookingStatus[] = ["Đã xác nhận", "Chờ khởi hành"];

const getActiveIndex = (status: OperationStatus): number => {
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 ? idx : 0;
};

const CANCELLABLE_STATUSES: ProfileBookingStatus[] = ["Đã xác nhận", "Chờ khởi hành"];
const CANCELLABLE_OPERATION_STATUSES: OperationStatus[] = ["SCHEDULED", "PREPARING", "BOARDING"];

const isRefundAllowed = (booking: ProfileBooking): boolean => {
  // Check by booking status (legacy flow)
  if (CANCELLABLE_STATUSES.includes(booking.status)) {
    return true;
  }
  // Check by operation status (new flow)
  if (booking.operationStatus && CANCELLABLE_OPERATION_STATUSES.includes(booking.operationStatus)) {
    return true;
  }
  return false;
};

const isRefundInProgress = (booking: ProfileBooking): boolean => {
  return booking.status === "Chờ hoàn tiền";
};

const isRefundNotAllowed = (booking: ProfileBooking): boolean => {
  const notRefundableStatuses: ProfileBookingStatus[] = [
    "Đã hủy",
    "Hoàn thành",
    "Chờ xác nhận",
    "Chưa thanh toán",
  ];
  if (notRefundableStatuses.includes(booking.status)) {
    return true;
  }
  if (booking.operationStatus === "COMPLETED" || booking.operationStatus === "CANCELLED") {
    return true;
  }
  return false;
};

const getRefundButtonState = (
  booking: ProfileBooking,
  isLoading?: boolean,
): { disabled: boolean; label: string; variant: "ghost" | "solid" | "danger" } => {
  if (isRefundInProgress(booking)) {
    return { disabled: true, label: "Đang chờ hoàn tiền", variant: "ghost" };
  }

  // Check operation status - disable if already started (BOARDING or later)
  if (booking.operationStatus && ["BOARDING", "DEPARTED", "APPROACHING", "MOVING", "ARRIVED", "COMPLETED", "CANCELLED"].includes(booking.operationStatus)) {
    return { disabled: true, label: "Không thể hủy vé", variant: "ghost" };
  }

  // Check time-based refund eligibility
  const refundInfo = getTimeUntilDeparture(booking.departureTime);
  if (!refundInfo.canRefund) {
    return { disabled: true, label: refundInfo.label, variant: "ghost" };
  }

  // Check legacy booking status
  if (isRefundAllowed(booking)) {
    return { disabled: !!isLoading, label: "Hủy vé hoàn tiền", variant: "danger" };
  }

  return { disabled: true, label: "Không thể hủy vé", variant: "ghost" };
};

const getTimeUntilDeparture = (departureTime?: string): { hours: number; canRefund: boolean; percentage: number; label: string } => {
  if (!departureTime) {
    return { hours: 0, canRefund: false, percentage: 0, label: "Không xác định" };
  }

  const departure = new Date(departureTime).getTime();
  const now = Date.now();
  const hoursUntilDeparture = (departure - now) / (1000 * 60 * 60);

  if (hoursUntilDeparture >= 24) {
    return { hours: hoursUntilDeparture, canRefund: true, percentage: 80, label: "Hoàn 80%" };
  } else if (hoursUntilDeparture >= 6) {
    return { hours: hoursUntilDeparture, canRefund: true, percentage: 50, label: "Hoàn 50%" };
  } else if (hoursUntilDeparture > 0) {
    return { hours: hoursUntilDeparture, canRefund: false, percentage: 0, label: "Không hoàn tiền" };
  } else {
    return { hours: 0, canRefund: false, percentage: 0, label: "Chuyến đã khởi hành" };
  }
};

const OperationStatusTracker = ({
  booking,
  onContactOperator,
  onRequestRefund,
  refundLoading,
}: TicketStatusTrackerProps) => {
  const status = booking.operationStatus!;
  const steps = STATUS_STEP_CONFIG[status];
  const activeIndex = getActiveIndex(status);
  const completedCount = activeIndex;
  const meta = OPERATION_STATUS_CONFIG[status];

  return (
    <div className="pt-tracker">
      <div className="pt-tracker__head">
        <div className="pt-tracker__head-text">
          <span className="pt-tracker__eyebrow">Theo dõi tình trạng chuyến</span>
          <h4 className="pt-tracker__title">{meta.label}</h4>
          <p className="pt-tracker__sub">
            Cập nhật lần cuối: vừa xong · {completedCount}/{steps.length} bước hoàn thành
          </p>
        </div>
        <div className="pt-tracker__progress-ring">
          <svg viewBox="0 0 36 36" className="pt-tracker__ring">
            <circle className="pt-tracker__ring-bg" cx="18" cy="18" r="15.9" />
            <circle
              className="pt-tracker__ring-fg"
              cx="18"
              cy="18"
              r="15.9"
              strokeDasharray={`${(completedCount / steps.length) * 100}, 100`}
              style={{ stroke: meta.color }}
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
                    className={`pt-tracker__line ${isDone ? "pt-tracker__line--done" : ""
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
        <button
          type="button"
          className="pt-tracker__btn pt-tracker__btn--solid"
          onClick={() => {
            if (booking.operatorCode && booking.operatorName) {
              onContactOperator(booking.operatorCode, booking.operatorName, booking.operatorUserId);
            }
          }}
          disabled={!booking.operatorCode || !booking.operatorName}
        >
          Liên hệ nhà xe
        </button>
        {onRequestRefund && (
          <button
            type="button"
            className={`pt-tracker__btn pt-tracker__btn--${getRefundButtonState(booking, refundLoading).variant}`}
            onClick={() => {
              const refundInfo = getTimeUntilDeparture(booking.departureTime);
              const totalAmount = booking.totalAmount ?? 0;
              const refundAmount = Math.round(totalAmount * (refundInfo.percentage / 100));

              Modal.confirm({
                title: "Xác nhận yêu cầu hủy vé hoàn tiền",
                icon: null,
                content: (
                  <div style={{ padding: "12px 0" }}>
                    <p style={{ marginBottom: 12 }}>
                      Bạn có chắc chắn muốn yêu cầu hủy vé hoàn tiền cho chuyến xe này không?
                    </p>
                    <div style={{
                      background: "#f5f5f5",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span>Phí hoàn tiền:</span>
                        <strong>{refundInfo.label}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Số tiền nhận lại:</span>
                        <strong style={{ color: "#22c55e" }}>
                          {refundAmount.toLocaleString("vi-VN")}đ
                        </strong>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#666" }}>
                      Thời gian xử lý hoàn tiền: 3-5 ngày làm việc
                    </p>
                  </div>
                ),
                okText: "Xác nhận hủy vé",
                cancelText: "Không, giữ vé",
                okButtonProps: {
                  danger: true,
                  style: { borderRadius: 8 },
                },
                cancelButtonProps: { style: { borderRadius: 8 } },
                async onOk() {
                  onRequestRefund(booking.id);
                },
              });
            }}
            disabled={getRefundButtonState(booking, refundLoading).disabled}
          >
            {refundLoading ? "Đang xử lý..." : getRefundButtonState(booking, refundLoading).label}
          </button>
        )}
      </div>
    </div>
  );
};

export const TicketStatusTracker = ({
  booking,
  onContactOperator,
  onRequestRefund,
  refundLoading,
}: TicketStatusTrackerProps) => {
  // Use operation status if available (new flow)
  if (booking.operationStatus && STATUS_STEP_CONFIG[booking.operationStatus]) {
    return (
      <OperationStatusTracker
        booking={booking}
        onContactOperator={onContactOperator}
        onRequestRefund={onRequestRefund}
        refundLoading={refundLoading}
      />
    );
  }

  // Fallback to legacy status flow
  if (!LEGACY_APPROVED_STATUSES.includes(booking.status)) {
    return null;
  }

  const steps = LEGACY_STEPS_BY_STATUS[booking.status];
  const activeIndex = LEGACY_ACTIVE_INDEX[booking.status];
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
                    className={`pt-tracker__line ${isDone ? "pt-tracker__line--done" : ""
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
        <button
          type="button"
          className="pt-tracker__btn pt-tracker__btn--solid"
          onClick={() => {
            if (booking.operatorCode && booking.operatorName) {
              onContactOperator(booking.operatorCode, booking.operatorName, booking.operatorUserId);
            }
          }}
          disabled={!booking.operatorCode || !booking.operatorName}
        >
          Liên hệ nhà xe
        </button>
        {onRequestRefund && (
          <button
            type="button"
            className={`pt-tracker__btn pt-tracker__btn--${getRefundButtonState(booking, refundLoading).variant}`}
            onClick={() => {
              const refundInfo = getTimeUntilDeparture(booking.departureTime);
              const totalAmount = booking.totalAmount ?? 0;
              const refundAmount = Math.round(totalAmount * (refundInfo.percentage / 100));

              Modal.confirm({
                title: "Xác nhận yêu cầu hủy vé hoàn tiền",
                icon: null,
                content: (
                  <div style={{ padding: "12px 0" }}>
                    <p style={{ marginBottom: 12 }}>
                      Bạn có chắc chắn muốn yêu cầu hủy vé hoàn tiền cho chuyến xe này không?
                    </p>
                    <div style={{
                      background: "#f5f5f5",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span>Phí hoàn tiền:</span>
                        <strong>{refundInfo.label}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Số tiền nhận lại:</span>
                        <strong style={{ color: "#22c55e" }}>
                          {refundAmount.toLocaleString("vi-VN")}đ
                        </strong>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#666" }}>
                      Thời gian xử lý hoàn tiền: 3-5 ngày làm việc
                    </p>
                  </div>
                ),
                okText: "Xác nhận hủy vé",
                cancelText: "Không, giữ vé",
                okButtonProps: {
                  danger: true,
                  style: { borderRadius: 8 },
                },
                cancelButtonProps: { style: { borderRadius: 8 } },
                async onOk() {
                  onRequestRefund(booking.id);
                },
              });
            }}
            disabled={getRefundButtonState(booking, refundLoading).disabled}
          >
            {refundLoading ? "Đang xử lý..." : getRefundButtonState(booking, refundLoading).label}
          </button>
        )}
      </div>
    </div>
  );
};
