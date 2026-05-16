import { formatVnd } from "@/common/contexts/booking";
import type { BookingSuccessData } from "../../types/confirm.types";

interface PaymentSummaryProps {
  data: BookingSuccessData;
}

const PaymentSummary = ({ data }: PaymentSummaryProps) => {
  const {
    seats,
    addons,
    subTotal,
    fee,
    promoCode,
    promoDiscount,
    total,
    trip,
  } = data;

  return (
    <div className="payment-summary">
      <div className="payment-summary__title">
        <i className="ti ti-receipt" aria-hidden="true" />
        Chi tiết thanh toán
      </div>

      <div className="payment-summary__rows">
        <div className="payment-summary__row">
          <span>Giá vé ({seats?.length} ghế)</span>
          <strong>{formatVnd(subTotal)}</strong>
        </div>

        {addons?.map((a) => (
          <div key={a.id} className="payment-summary__row">
            <span>{a.name}</span>
            <strong style={a.price === 0 ? { color: "#16a34a" } : undefined}>
              {a.price === 0 ? "Miễn phí" : formatVnd(a.price)}
            </strong>
          </div>
        ))}

        <div className="payment-summary__row">
          <span>Phí dịch vụ</span>
          <strong>{formatVnd(fee)}</strong>
        </div>

        {promoDiscount > 0 && (
          <div className="payment-summary__row payment-summary__row--promo">
            <span>Giảm giá ({promoCode})</span>
            <strong>−{formatVnd(promoDiscount)}</strong>
          </div>
        )}

        <div className="payment-summary__row payment-summary__row--total">
          <span>Tổng đã thanh toán</span>
          <strong>{formatVnd(total)}</strong>
        </div>

        <div className="payment-summary__row payment-summary__row--method">
          <span>
            <i className="ti ti-credit-card" aria-hidden="true" />
            {trip?.paymentMethod?.label}
          </span>
          <span className="payment-summary__card-last4">
            •••• {trip?.paymentMethod?.last4}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
