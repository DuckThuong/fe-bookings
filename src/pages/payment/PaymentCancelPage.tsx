import { useSearchParams } from "react-router-dom";
import { HomeHeader } from "@/components/TopBar";
import { Result, Button } from "antd";
import { ROUTER_PATH } from "@/routers/Route";
import "./PaymentCancelPage.scss";

export const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");

  return (
    <div className="payment-result-page">
      <HomeHeader />

      <div className="payment-result-container">
        <Result
          status="warning"
          title="Đã hủy thanh toán"
          subTitle={
            orderCode
              ? `Mã đơn hàng: ${orderCode}`
              : "Thanh toán đã bị hủy bỏ."
          }
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => (window.location.href = ROUTER_PATH.HOME)}
            >
              Quay lại trang chủ
            </Button>,
            <Button
              key="contact"
              onClick={() => (window.location.href = ROUTER_PATH.SUPPORT)}
            >
              Liên hệ hỗ trợ
            </Button>,
          ]}
        />

        <div className="payment-cancel-info">
          <p>
            Nếu bạn đã thanh toán nhưng vẫn thấy thông báo này, vui lòng đợi
            5-10 phút để hệ thống cập nhật.
          </p>
          <p>Hoặc liên hệ hotline để được hỗ trợ.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
