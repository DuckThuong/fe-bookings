import type {
  BookingConfirmData,
  BookingSuccessData,
  SelectedSeat,
} from "../../types/confirm.types";
import {
  getDropoffPointLabel,
  getPickupPointLabel,
} from "../../utils/booking.utils";

const TicketCard = ({
  data,
  seats,
}: {
  data: BookingConfirmData;
  seats: SelectedSeat[];
}) => {
  const { trip } = data.pageData;
  const successTrip = (data as Partial<BookingSuccessData>).trip;
  const busType =
    successTrip?.busType ??
    (data.vehicleType ? `Xe ${data.vehicleType} cho` : "Xe khach");
  const rating = successTrip?.rating ?? 4.8;
  const hasInsurance =
    successTrip?.hasInsurance ??
    data.addons.some((addon) => addon.id === "insurance");
  const departStation =
    successTrip?.departStation ?? getPickupPointLabel(data.pageData.passenger);
  const arriveStation =
    successTrip?.arriveStation ?? getDropoffPointLabel(data.pageData.passenger);
  const stopsLabel = successTrip?.stopsLabel ?? "Thang, khong dung";

  return (
    <div className="confirm-ticket">
      <div className="confirm-ticket__header">
        <div className="confirm-ticket__logo">{trip.operatorCode}</div>
        <div className="confirm-ticket__op-info">
          <div className="confirm-ticket__op-name">{trip.operatorName}</div>
          <div className="confirm-ticket__op-type">{busType}</div>
        </div>
        <div className="confirm-ticket__badges">
          <span className="confirm-tbadge">
            <i className="ti ti-star-filled" aria-hidden="true" /> {rating}
          </span>
          {hasInsurance && (
            <span className="confirm-tbadge">
              <i className="ti ti-shield-check" aria-hidden="true" /> Bao hiem
            </span>
          )}
          <span className="confirm-tbadge">
            <i className="ti ti-wifi" aria-hidden="true" /> Wifi 5G
          </span>
        </div>
      </div>

      <div className="confirm-ticket__route">
        <div className="confirm-ticket__endpoint">
          <div className="confirm-ticket__time">{trip.departTime}</div>
          <div className="confirm-ticket__city">{trip.from}</div>
          <div className="confirm-ticket__station">{departStation}</div>
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
          <div className="confirm-ticket__stops">{stopsLabel}</div>
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
          <div className="confirm-ticket__station">{arriveStation}</div>
        </div>
      </div>

      <div className="confirm-ticket__punch">
        <div className="confirm-ticket__punch-line" />
      </div>

      <div className="confirm-ticket__details">
        {[
          { label: "Ngay khoi hanh", icon: "ti-calendar", val: trip.date },
          { label: "Loai xe", icon: "ti-bed", val: busType },
          {
            label: "Diem len xe",
            icon: "ti-map-pin",
            val: departStation,
          },
          {
            label: "Diem xuong xe",
            icon: "ti-map-pin-2",
            val: arriveStation,
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

      <div className="confirm-ticket__seats">
        <span className="confirm-ticket__seats-label">Ghe da chon</span>
        <div className="confirm-ticket__seat-chips">
          {seats.map((s) => (
            <div key={s.id} className="confirm-ticket__seat-chip">
              <i className="ti ti-armchair" aria-hidden="true" />
              {s.label || s.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
