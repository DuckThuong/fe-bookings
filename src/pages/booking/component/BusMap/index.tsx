import { Seat } from "../Seat";
import type { RowDef } from "@/common/types/booking";

export const BusMap = ({
  layout,
  selected,
  isSleeper,
  onToggle,
}: {
  layout: RowDef[];
  selected: Set<string>;
  isSleeper: boolean;
  onToggle: (id: string) => void;
}) => (
  <div className="seat-map__shell">
    {/* Front row */}
    <div className="seat-map__front">
      <div className="seat-map__driver">
        <i className="ti ti-steering-wheel" aria-hidden="true" />
        Tài xế
      </div>
      <div className="seat-map__wheel">
        <i className="ti ti-steering-wheel" aria-hidden="true" />
      </div>
      <div className="seat-map__door">
        <i className="ti ti-door" aria-hidden="true" />
      </div>
    </div>

    {/* Seat rows */}
    <div className="seat-map__rows">
      {layout.map((rowDef) => (
        <div key={rowDef.row} className="seat-map__row">
          <span className="seat-map__row-num">{rowDef.row}</span>
          {(rowDef.cells ??
            rowDef.seats?.map((seat) =>
              seat ? ({ type: "seat", ...seat } as const) : { type: "aisle" as const },
            ) ??
            []
          ).map((cell, ci) =>
            cell.type === "aisle" ? (
              <div key={ci} className="seat-map__aisle" />
            ) : cell.type === "empty" ? (
              <div key={ci} className="seat-map__empty" />
            ) : (
              <Seat
                key={cell.id}
                seat={cell}
                selected={selected.has(cell.id)}
                isSleeper={!!isSleeper}
                onToggle={onToggle}
              />
            ),
          )}
        </div>
      ))}
    </div>
  </div>
);
