import { Button, message } from "antd";
import type { TripInfo } from "../../types/confirm.types";

interface SuccessHeroProps {
  bookingId: TripInfo["bookingId"];
  phone: string;
  pendingApproval?: boolean;
  isError?: boolean;
}

const SuccessHero = ({
  bookingId,
  phone,
  pendingApproval = false,
  isError = false,
}: SuccessHeroProps) => {
  const handleCopy = () => {
    if (bookingId) {
      navigator.clipboard?.writeText(bookingId);
      message.success("Đã sao chép mã đặt vé");
    }
  };

  if (isError) {
    return (
      <div className="success-hero success-hero--error">
        <div className="success-hero__ring-wrap">
          <div className="success-hero__ring-pulse success-hero__ring-pulse--error" />
          <div className="success-hero__ring-pulse success-hero__ring-pulse--2 success-hero__ring-pulse--error" />
          <svg
            className="success-hero__check-svg"
            viewBox="0 0 88 88"
            fill="none"
          >
            <circle
              cx="44"
              cy="44"
              r="42"
              fill="#fef2f2"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
            <path
              className="success-hero__check-path"
              d="M32 32l24 24M56 32L32 56"
              stroke="#dc2626"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="success-hero__title success-hero__title--error">
          Thanh toán thất bại
        </h1>
        <p className="success-hero__sub">
          Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </p>

        <div className="success-hero__actions">
          <Button
            className="success-hero__btn-primary"
            icon={<i className="ti ti-refresh" aria-hidden="true" />}
          >
            Thử lại
          </Button>
          <Button
            className="success-hero__btn-outline"
            icon={<i className="ti ti-headphones" aria-hidden="true" />}
          >
            Liên hệ hỗ trợ
          </Button>
          <Button
            className="success-hero__btn-ghost"
            icon={<i className="ti ti-home" aria-hidden="true" />}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="success-hero">
      <div className="success-hero__ring-wrap">
        <div className="success-hero__ring-pulse" />
        <div className="success-hero__ring-pulse success-hero__ring-pulse--2" />
        <svg
          className="success-hero__check-svg"
          viewBox="0 0 88 88"
          fill="none"
        >
          <circle
            cx="44"
            cy="44"
            r="42"
            fill="#dcfce7"
            stroke="#22c55e"
            strokeWidth="1.5"
          />
          <path
            className="success-hero__check-path"
            d="M26 44l13 13 23-22"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="success-hero__booking-id">
        <i className="ti ti-ticket" aria-hidden="true" />
        Mã đặt vé:&nbsp;<span>{bookingId}</span>
        <button
          onClick={handleCopy}
          className="success-hero__copy-btn"
          title="Sao chép"
          aria-label="Sao chép mã đặt vé"
        >
          <i className="ti ti-copy" aria-hidden="true" />
        </button>
      </div>

      <h1 className="success-hero__title">
        {pendingApproval ? "Đã gửi yêu cầu đặt vé!" : "Đặt vé thành công!"}
      </h1>
      <p className="success-hero__sub">
        {pendingApproval ? (
          <>
            Đơn của bạn đang <strong>chờ nhà xe xác nhận</strong>. Mã đặt vé:{" "}
            <strong>{bookingId}</strong>.
            <br />
            Chúng tôi sẽ thông báo qua <strong>{phone}</strong> và email khi vé
            được duyệt.
          </>
        ) : (
          <>
            Vé điện tử đã được gửi đến <strong>{phone}</strong> và email của
            bạn.
            <br />
            Chúc bạn có một hành trình thật tuyệt vời.
          </>
        )}
      </p>

      <div className="success-hero__actions">
        <Button
          className="success-hero__btn-primary"
          icon={<i className="ti ti-download" aria-hidden="true" />}
        >
          Tải vé PDF
        </Button>
        <Button
          className="success-hero__btn-outline"
          icon={<i className="ti ti-share" aria-hidden="true" />}
        >
          Chia sẻ vé
        </Button>
        <Button
          className="success-hero__btn-ghost"
          icon={<i className="ti ti-home" aria-hidden="true" />}
        >
          Về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default SuccessHero;
