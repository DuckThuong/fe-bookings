import type {
  BookingConfirmData,
  SelectedSeat,
} from "../../types/confirm.types";

const TicketCard = ({
  data,
  seats,
}: {
  data: BookingConfirmData;
  seats: SelectedSeat[];
}) => {
  const { trip } = data.pageData;
  return (
    <div className="confirm-ticket">
      {/* Header */}
      <div className="confirm-ticket__header">
        <div className="confirm-ticket__logo">{trip.operatorCode}</div>
        <div className="confirm-ticket__op-info">
          <div className="confirm-ticket__op-name">{trip.operatorName}</div>
          <div className="confirm-ticket__op-type">Giường nằm VIP 40 chỗ</div>
        </div>
        <div className="confirm-ticket__badges">
          <span className="confirm-tbadge">
            <i className="ti ti-star-filled" aria-hidden="true" /> 4.9
          </span>
          <span className="confirm-tbadge">
            <i className="ti ti-shield-check" aria-hidden="true" /> Bảo hiểm
          </span>
          <span className="confirm-tbadge">
            <i className="ti ti-wifi" aria-hidden="true" /> Wifi 5G
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="confirm-ticket__route">
        <div className="confirm-ticket__endpoint">
          <div className="confirm-ticket__time">{trip.departTime}</div>
          <div className="confirm-ticket__city">{trip.from}</div>
          <div className="confirm-ticket__station">
            {data.pageData.passenger.pickupPointOptions.find(
              (o) => o.value === data.pageData.passenger.pickupPointDefault,
            )?.label ?? "—"}
          </div>
        </div>

        <div className="confirm-ticket__journey">
          <div className="confirm-ticket__duration">{trip.durationLabel}</div>
          <div className="confirm-ticket__line">
            <span className="confirm-ticket__dot" />
            <span className="confirm-ticket__dash" />
            <i className="ti ti-bus" aria-hidden="true" />
            <span className="confirm-ticket__dash" />
            <span className="confirm-ticket__dot" />
          </div>
          <div className="confirm-ticket__stops">Thẳng, không dừng</div>
        </div>

        <div className="confirm-ticket__endpoint confirm-ticket__endpoint--right">
          <div className="confirm-ticket__time">
            {trip.arriveTime}
            {trip.arriveNote && (
              <span className="confirm-ticket__arrive-note">
                {" "}
                {trip.arriveNote}
              </span>
            )}
          </div>
          <div className="confirm-ticket__city">{trip.to}</div>
          <div className="confirm-ticket__station">
            {data.pageData.passenger.dropoffPointOptions.find(
              (o) => o.value === data.pageData.passenger.dropoffPointDefault,
            )?.label ?? "—"}
          </div>
        </div>
      </div>

      {/* Punch divider */}
      <div className="confirm-ticket__punch">
        <div className="confirm-ticket__punch-line" />
      </div>

      {/* Detail grid */}
      <div className="confirm-ticket__details">
        {[
          { label: "Ngày khởi hành", icon: "ti-calendar", val: trip.date },
          { label: "Loại xe", icon: "ti-bed", val: "Giường nằm VIP" },
          {
            label: "Điểm lên xe",
            icon: "ti-map-pin",
            val:
              data.pageData.passenger.pickupPointOptions.find(
                (o) => o.value === data.pageData.passenger.pickupPointDefault,
              )?.label ?? "—",
          },
          {
            label: "Điểm xuống xe",
            icon: "ti-map-pin-2",
            val:
              data.pageData.passenger.dropoffPointOptions.find(
                (o) => o.value === data.pageData.passenger.dropoffPointDefault,
              )?.label ?? "—",
          },
        ].map((d) => (
          <div key={d.label} className="confirm-ticket__detail-item">
            <div className="confirm-ticket__detail-label">{d.label}</div>
            <div className="confirm-ticket__detail-val">
              <i className={`ti ${d.icon}`} aria-hidden="true" />
              {d.val}
            </div>
          </div>
        ))}
      </div>

      {/* Seats row */}
      <div className="confirm-ticket__seats">
        <span className="confirm-ticket__seats-label">Ghế đã chọn</span>
        <div className="confirm-ticket__seat-chips">
          {seats.map((s) => (
            <div key={s.id} className="confirm-ticket__seat-chip">
              <i className="ti ti-armchair" aria-hidden="true" />
              {s.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
