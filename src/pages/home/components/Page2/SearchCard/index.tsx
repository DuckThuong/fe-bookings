import { useState } from "react";
import { Button, DatePicker, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import { SEAT_TYPES, type SeatType } from "@/common/types/ticket";

interface RouteField {
  city: string;
  station: string;
}

interface SearchCardProps {
  onSearch?: (params: {
    from: RouteField;
    to: RouteField;
    date: string;
    passengers: number;
    seatType: SeatType;
  }) => void;
}

const DEFAULT_FROM: RouteField = { city: "Hà Nội", station: "Bến xe Mỹ Đình" };
const DEFAULT_TO: RouteField = {
  city: "TP. Hồ Chí Minh",
  station: "Bến xe Miền Đông",
};

const RouteFieldBox = ({
  label,
  value,
  icon,
  active,
}: {
  label: string;
  value: RouteField;
  icon: string;
  active?: boolean;
}) => (
  <div className="sc-field-group">
    <p className="sc-label">{label}</p>
    <div className={`sc-field${active ? " sc-field--active" : ""}`}>
      <span className="sc-field__icon">{icon}</span>
      <div>
        <div className="sc-field__city">{value.city}</div>
        <div className="sc-field__station">{value.station}</div>
      </div>
    </div>
  </div>
);

const PassengerCounter = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="sc-field-group">
    <p className="sc-label">👤 Hành khách</p>
    <div className="sc-field sc-field--pax">
      <button
        className="sc-pax-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Giảm"
      >
        −
      </button>
      <span className="sc-pax-num">{value}</span>
      <button
        className="sc-pax-btn"
        onClick={() => onChange(Math.min(9, value + 1))}
        aria-label="Tăng"
      >
        +
      </button>
    </div>
    <p className="sc-pax-hint">người lớn</p>
  </div>
);

export const SearchCard = ({ onSearch }: SearchCardProps) => {
  const [from, setFrom] = useState<RouteField>(DEFAULT_FROM);
  const [to, setTo] = useState<RouteField>(DEFAULT_TO);
  const [date, setDate] = useState(dayjs());
  const [passengers, setPax] = useState(1);
  const [seatType, setSeat] = useState<SeatType>("all");

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    onSearch?.({
      from,
      to,
      date: date.format("DD/MM/YYYY"),
      passengers,
      seatType,
    });
  };

  return (
    <div className="search-card">
      <div className="search-card__row">
        <RouteFieldBox label="📍 Điểm đi" value={from} icon="📌" active />

        <Tooltip title="Đổi chiều">
          <button
            className="search-card__swap"
            onClick={handleSwap}
            aria-label="Đổi chiều"
          >
            ⇌
          </button>
        </Tooltip>

        <RouteFieldBox label="📍 Điểm đến" value={to} icon="🏁" />

        <div className="sc-field-group">
          <p className="sc-label">📅 Ngày đi</p>
          <DatePicker
            className="search-card__datepicker"
            value={date}
            onChange={(d) => d && setDate(d)}
            format="DD/MM/YYYY"
            disabledDate={(d) => d.isBefore(dayjs().startOf("day"))}
            allowClear={false}
          />
        </div>

        <PassengerCounter value={passengers} onChange={setPax} />

        <Button
          type="primary"
          className="search-card__btn"
          onClick={handleSearch}
        >
          🔍 Tìm chuyến
        </Button>
      </div>

      <div className="search-card__seat-row">
        <span className="sc-label" style={{ marginBottom: 0 }}>
          Loại ghế
        </span>
        <div className="search-card__seat-chips">
          {SEAT_TYPES.map((s) => (
            <button
              key={s.key}
              className={`seat-chip${seatType === s.key ? " seat-chip--active" : ""}`}
              onClick={() => setSeat(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
