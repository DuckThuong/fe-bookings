import { Button } from "antd";
import { EditOutlined, SafetyOutlined } from "@ant-design/icons";
import "./PaymentCard.scss";

interface PaymentCardProps {
  onOpenPayment?: () => void;
}

export const PaymentCard = ({ onOpenPayment }: PaymentCardProps) => (
  <div className="pi-payment-card">
    <div className="pi-bank-card">
      <div className="pi-bank-card__top">
        <span className="pi-bank-card__chip" aria-hidden="true" />
        <span className="pi-bank-card__network">VISA</span>
      </div>
      <div className="pi-bank-card__number">•••• •••• •••• 1234</div>
      <div className="pi-bank-card__bottom">
        <div>
          <p className="pi-bank-card__label">Chủ thẻ</p>
          <p className="pi-bank-card__value">NGUYEN VAN A</p>
        </div>
        <div>
          <p className="pi-bank-card__label">Hết hạn</p>
          <p className="pi-bank-card__value">08 / 27</p>
        </div>
      </div>
    </div>

    <div className="pi-payment-detail">
      <h4 className="pi-payment-detail__title">Phương thức thanh toán</h4>
      <p className="pi-payment-detail__sub">
        Quản lý thẻ để đặt vé nhanh và an toàn hơn.
      </p>

      {[
        { label: "Loại thẻ", value: "Thẻ tín dụng" },
        { label: "Nhà phát hành", value: "Visa" },
        { label: "Số thẻ", value: "**** 1234" },
      ].map((row) => (
        <div key={row.label} className="pi-payment-row">
          <span className="pi-payment-row__label">{row.label}</span>
          <span className="pi-payment-row__value">{row.value}</span>
        </div>
      ))}
    </div>

    <div className="pi-payment-secure">
      <SafetyOutlined className="pi-payment-secure__icon" />
      <span>Thông tin thẻ được mã hoá SSL 256-bit</span>
    </div>
  </div>
);
