import { useSearchParams } from "react-router-dom";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useQuery } from "@tanstack/react-query";
import { Button, Result, Spin } from "antd";
import { useEffect } from "react";
import { getBookingByPaymentLink, getPaymentStatus } from "@/api/configs/payment.config";
import "./PaymentCancelPage.scss";

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { setLoading } = useLoading();
  const orderCode = searchParams.get("orderCode");
  const paymentLinkId = searchParams.get("id");

  // Handle case where there's no paymentLinkId
  if (!paymentLinkId) {
    return (
      <div className="payment-result-page">
        <HomeHeader />
        <div className="payment-result-container">
          <Result
            status="warning"
            title="Không tìm thấy thông tin thanh toán"
            subTitle="Vui lòng kiểm tra lại đường link thanh toán."
            extra={[
              <Button
                type="primary"
                key="home"
                onClick={() => (window.location.href = ROUTER_PATH.HOME)}
              >
                Về trang chủ
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  const { data: paymentStatus, isLoading: isPaymentLoading, isError: isPaymentError } = useQuery({
    queryKey: ["payment-status", paymentLinkId],
    queryFn: () => getPaymentStatus(paymentLinkId),
    retry: 1,
  });

  const { data: bookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: ["booking-by-payment", paymentLinkId],
    queryFn: () => getBookingByPaymentLink(paymentLinkId),
    enabled: Boolean(paymentLinkId) && paymentStatus?.status === "PAID",
    staleTime: 60_000,
  });

  const isLoading = isPaymentLoading || isBookingLoading;

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (isLoading) {
    return (
      <div className="payment-result-page">
        <HomeHeader />
        <div className="payment-result-loading">
          <Spin size="large" />
          <p>Đang kiểm tra trạng thái thanh toán...</p>
        </div>
      </div>
    );
  }

  // Handle payment error or failure
  if (isPaymentError || paymentStatus?.status !== "PAID") {
    return (
      <div className="payment-result-page">
        <HomeHeader />
        <div className="payment-result-container">
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle="Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."
            extra={[
              <Button
                type="primary"
                key="home"
                onClick={() => (window.location.href = ROUTER_PATH.HOME)}
              >
                Về trang chủ
              </Button>,
              <Button
                key="retry"
                onClick={() => (window.location.href = ROUTER_PATH.SUPPORT)}
              >
                Liên hệ hỗ trợ
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  const isSuccess = paymentStatus?.status === "PAID";

  return (
    <div className="payment-result-page">
      <HomeHeader />

      <div className="payment-result-container">
        <Result
          status={isSuccess ? "success" : "error"}
          title={isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
          subTitle={
            isSuccess
              ? `Mã đơn hàng: ${orderCode}`
              : "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."
          }
          extra={[
            <Button
              type="primary"
              key="home"
              onClick={() => (window.location.href = ROUTER_PATH.HOME)}
            >
              Về trang chủ
            </Button>,
            <Button
              key="history"
              onClick={() => (window.location.href = ROUTER_PATH.PROFILE)}
            >
              Xem lịch sử đặt vé
            </Button>,
          ]}
        />

        {isSuccess && bookingData && (
          <div className="payment-result-details">
            <div className="payment-result-card">
              <h3>Chi tiết đặt vé</h3>
              <div className="detail-row">
                <span>Mã vé:</span>
                <span>{bookingData.bookingId}</span>
              </div>
              <div className="detail-row">
                <span>Tuyến:</span>
                <span>
                  {bookingData.trip.departCity} → {bookingData.trip.arriveCity}
                </span>
              </div>
              <div className="detail-row">
                <span>Ngày khởi hành:</span>
                <span>{bookingData.trip.date}</span>
              </div>
              <div className="detail-row">
                <span>Giờ khởi hành:</span>
                <span>{bookingData.trip.departTime}</span>
              </div>
              <div className="detail-row">
                <span>Số ghế:</span>
                <span>{bookingData.seats?.length || 0}</span>
              </div>
              <div className="detail-row">
                <span>Phương thức thanh toán:</span>
                <span>{bookingData.trip.paymentMethod?.label || "PayOS"}</span>
              </div>
            </div>
          </div>
        )}

        {isSuccess && paymentStatus && (
          <div className="payment-result-card payment-result-card--payment">
            <h3>Chi tiết thanh toán</h3>
            <div className="detail-row">
              <span>Mã thanh toán:</span>
              <span>{paymentLinkId}</span>
            </div>
            <div className="detail-row">
              <span>Mã đơn hàng:</span>
              <span>{orderCode}</span>
            </div>
            <div className="detail-row">
              <span>Số tiền:</span>
              <span className="amount">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(paymentStatus.amount)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
