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
  const cls = [
    "seat-map__seat",
    isSleeper && "seat-map__seat--sleeper",
    seat.status === "booked" && "seat-map__seat--booked",
    seat.status === "vip" && "seat-map__seat--vip",
    selected && "seat-map__seat--selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button
      className={cls}
      onClick={() => seat.status !== "booked" && onToggle(seat.id)}
      title={seat.status === "booked" ? "Đã đặt" : seat.id}
      aria-label={`Ghế ${seat.id}`}
      aria-pressed={selected}
      type="text"
      disabled={seat.status === "booked"}
    >
      {seat.status === "booked" ? (
        <i className="ti ti-x" aria-hidden="true" />
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
