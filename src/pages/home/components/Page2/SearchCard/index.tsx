import { useState } from "react";
import { AutoComplete, Button, DatePicker, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import { SEAT_TYPES, type SeatType } from "@/common/types/ticket";
import pinnedIcn from "@/assets/icons/pinned.svg";
import arrowDownIcn from "@/assets/icons/arrowDown.svg";
import {
  HOME_CITIES,
  HOME_DESTINATIONS,
  HOME_QUICK_ROUTES,
} from "../../../shared/searchData";

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
  city: "Đà Nẵng",
  station: "Bến xe Trung tâm Đà Nẵng",
};

const STATIONS_BY_CITY: Record<string, string[]> = {
  "Hà Nội": ["Bến xe Mỹ Đình", "Bến xe Giáp Bát", "Bến xe Nước Ngầm"],
  "TP. Hồ Chí Minh": ["Bến xe Miền Đông", "Bến xe Miền Tây"],
  "Đà Nẵng": ["Bến xe Trung tâm Đà Nẵng"],
  "Hải Phòng": ["Bến xe Niệm Nghĩa", "Bến xe Cầu Rào"],
  "Cần Thơ": ["Bến xe Trung tâm Cần Thơ"],
  "Đà Lạt": ["Bến xe Liên tỉnh Đà Lạt"],
  "Nha Trang": ["Bến xe Phía Nam Nha Trang"],
  Huế: ["Bến xe phía Nam Huế"],
  Vinh: ["Bến xe Vinh"],
  "Vũng Tàu": ["Bến xe Vũng Tàu"],
};

const getDefaultStation = (city: string) => STATIONS_BY_CITY[city]?.[0] ?? "";

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
  const [from, setFrom] = useState<RouteField>(DEFAULT_FROM);
  const [to, setTo] = useState<RouteField>(DEFAULT_TO);
  const [date, setDate] = useState(dayjs());
  const [passengers, setPax] = useState(1);
  const [seatType, setSeat] = useState<SeatType>("all");

  const fromOptions = [...HOME_CITIES]
    .filter(
      (c) => c.toLowerCase().includes(from.city.toLowerCase()) && from.city,
    )
    .map((c) => ({ value: c, label: c }));

  const toOptions = [...HOME_DESTINATIONS]
    .filter((c) => c.toLowerCase().includes(to.city.toLowerCase()) && to.city)
    .map((c) => ({ value: c, label: c }));

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const applyQuickRoute = (fromCity: string, toCity: string) => {
    setFrom((prev) => ({
      ...prev,
      city: fromCity,
      station: getDefaultStation(fromCity) || prev.station,
    }));
    setTo((prev) => ({
      ...prev,
      city: toCity,
      station: getDefaultStation(toCity) || prev.station,
    }));
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
        <div className="search-card__route">
          <div className="hero__search-field">
            <span className="hero__field-icon">
              <img src={pinnedIcn} alt="From" width={14} height={14} />
            </span>
            <AutoComplete
              value={from.city}
              options={fromOptions}
              onChange={(value) =>
                setFrom((prev) => ({
                  ...prev,
                  city: value,
                  station: STATIONS_BY_CITY[value]?.includes(prev.station)
                    ? prev.station
                    : getDefaultStation(value) || prev.station,
                }))
              }
              className="hero__autocomplete"
              placeholder="Điểm đi"
              popupMatchSelectWidth={false}
            />
          </div>

          <Select
            value={from.station}
            onChange={(station) => setFrom((prev) => ({ ...prev, station }))}
            className="search-card__station"
            placeholder="Chọn bến xe"
            options={(STATIONS_BY_CITY[from.city] ?? []).map((s) => ({
              value: s,
              label: s,
            }))}
          />
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
          <div className="hero__search-field">
            <span className="hero__field-icon">
              <img src={arrowDownIcn} alt="To" width={14} height={14} />
            </span>
            <AutoComplete
              value={to.city}
              options={toOptions}
              onChange={(value) =>
                setTo((prev) => ({
                  ...prev,
                  city: value,
                  station: STATIONS_BY_CITY[value]?.includes(prev.station)
                    ? prev.station
                    : getDefaultStation(value) || prev.station,
                }))
              }
              className="hero__autocomplete"
              placeholder="Điểm đến"
              popupMatchSelectWidth={false}
            />
          </div>

          <Select
            value={to.station}
            onChange={(station) => setTo((prev) => ({ ...prev, station }))}
            className="search-card__station"
            placeholder="Chọn bến xe"
            options={(STATIONS_BY_CITY[to.city] ?? []).map((s) => ({
              value: s,
              label: s,
            }))}
          />
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
              onClick={() => setSeat(s.key)}
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
