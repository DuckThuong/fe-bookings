import { Button } from "antd";
import type { SeatDef } from "@/common/types/booking";

export const Seat = ({
  seat,
  selected,
  isSleeper,
  onToggle,
}: {
  seat: SeatDef;
  selected: boolean;
  isSleeper: boolean;
  onToggle: (id: string) => void;
}) => {
  const isBooked = seat.status === "booked";
  const cls = [
    "seat-map__seat",
    isSleeper && "seat-map__seat--sleeper",
    isBooked && "seat-map__seat--booked",
    seat.status === "vip" && "seat-map__seat--vip",
    selected && "seat-map__seat--selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button
      className={cls}
      onClick={() => !isBooked && onToggle(seat.id)}
      title={isBooked ? "Đã đặt" : seat.id}
      aria-label={`Ghế ${seat.id}`}
      aria-pressed={selected}
      type="text"
      aria-disabled={isBooked}
    >
      {isBooked ? (
        <>
          <span aria-hidden="true">×</span>
          <span className="seat-map__seat-num">{seat.id}</span>
        </>
      ) : (
        <>
          <i
            className={isSleeper ? "ti ti-bed" : "ti ti-armchair"}
            aria-hidden="true"
          />
          <span className="seat-map__seat-num">{seat.id}</span>
        </>
      )}
    </Button>
  );
};
