import "./CashNote.scss";

export const CashNote = () => (
  <div className="pp-cash-note">
    <span className="pp-cash-note__icon">💵</span>
    <div>
      <p className="pp-cash-note__title">Thanh toán tiền mặt tại quầy</p>
      <p className="pp-cash-note__desc">
        Hệ thống sẽ giữ chỗ trong 30 phút. Vui lòng đến quầy đúng giờ để hoàn
        tất thanh toán và nhận vé.
      </p>
    </div>
  </div>
);
