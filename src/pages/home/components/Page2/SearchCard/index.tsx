import { useState } from "react";
import { AutoComplete, Button, DatePicker, Tooltip } from "antd";
import dayjs from "dayjs";
import { SEAT_TYPES, type SeatType } from "@/common/types/ticket";
import pinnedIcn from "@/assets/icons/pinned.svg";
import arrowDownIcn from "@/assets/icons/arrowDown.svg";
import {
  HOME_CITIES,
  HOME_DESTINATIONS,
  HOME_QUICK_ROUTES,
} from "../../../shared/searchData";

interface SearchCardProps {
  onSearch?: (params: {
    fromCity: string;
    toCity: string;
    date: string;
    passengers: number;
    seatType: SeatType;
  }) => void;
}

const PassengerCounter = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="sc-field-group">
    <p className="sc-label">
      👤 Hành khách / <span className="sc-pax-hint">người lớn</span>
    </p>
    <div className="sc-field sc-field--pax">
      <Button
        className="sc-pax-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Giảm"
        type="text"
      >
        −
      </Button>
      <span className="sc-pax-num">{value}</span>
      <Button
        className="sc-pax-btn"
        onClick={() => onChange(Math.min(9, value + 1))}
        aria-label="Tăng"
        type="text"
      >
        +
      </Button>
    </div>
  </div>
);

export const SearchCard = ({ onSearch }: SearchCardProps) => {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [date, setDate] = useState(dayjs());
  const [passengers, setPax] = useState(1);
  const [seatType, setSeat] = useState<SeatType>("all");

  const triggerSearch = (nextSeatType: SeatType = seatType) => {
    onSearch?.({
      fromCity: from,
      toCity: to,
      date: date.format("DD/MM/YYYY"),
      passengers,
      seatType: nextSeatType,
    });
  };

  const fromOptions = [...HOME_CITIES]
    .filter((c) => c.toLowerCase().includes(from.toLowerCase()) && from)
    .map((c) => ({ value: c, label: c }));

  const toOptions = [...HOME_DESTINATIONS]
    .filter((c) => c.toLowerCase().includes(to.toLowerCase()) && to)
    .map((c) => ({ value: c, label: c }));

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const applyQuickRoute = (fromCity: string, toCity: string) => {
    setFrom(fromCity);
    setTo(toCity);
  };

  const handleSearch = () => {
    triggerSearch();
  };

  return (
    <div className="search-card">
      <div className="search-card__row">
        <div className="search-card__route">
          <p className="sc-label">Điểm đi</p>
          <div className="hero__search-field">
            <span className="hero__field-icon">
              <img src={pinnedIcn} alt="From" width={14} height={14} />
            </span>
            <AutoComplete
              value={from}
              options={fromOptions}
              onChange={setFrom}
              className="hero__autocomplete"
              placeholder="Hà Nội"
              popupMatchSelectWidth={false}
            />
          </div>
        </div>

        <Tooltip title="Đổi chiều">
          <Button
            className="search-card__swap"
            onClick={handleSwap}
            aria-label="Đổi chiều"
            type="text"
          >
            ⇌
          </Button>
        </Tooltip>

        <div className="search-card__route">
          <p className="sc-label">Điểm đến</p>
          <div className="hero__search-field">
            <span className="hero__field-icon">
              <img src={arrowDownIcn} alt="To" width={14} height={14} />
            </span>
            <AutoComplete
              value={to}
              options={toOptions}
              onChange={setTo}
              className="hero__autocomplete"
              placeholder="Đà Nẵng"
              popupMatchSelectWidth={false}
            />
          </div>
        </div>

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

      <div className="search-card__quick">
        <span className="sc-label sc-label--inline">Tuyến phổ biến:</span>
        <div className="search-card__quick-viewport">
          <div className="search-card__quick-track">
            {[...HOME_QUICK_ROUTES, ...HOME_QUICK_ROUTES].map((r, idx) => (
              <Button
                key={`${r.from}-${r.to}-${idx}`}
                className="search-card__quick-tag"
                onClick={() => applyQuickRoute(r.from, r.to)}
                type="default"
                size="small"
              >
                {r.from} → {r.to}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="search-card__seat-row">
        <span className="sc-label sc-label--inline">Loại ghế</span>
        <div className="search-card__seat-chips">
          {SEAT_TYPES.map((s) => (
            <Button
              key={s.key}
              className={`seat-chip${seatType === s.key ? " seat-chip--active" : ""}`}
              onClick={() => {
                setSeat(s.key);
                triggerSearch(s.key);
              }}
              type="default"
              size="small"
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
