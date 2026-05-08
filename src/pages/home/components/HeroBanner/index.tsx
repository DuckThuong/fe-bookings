import { useState } from "react";
import { AutoComplete, Button, DatePicker } from "antd";
import dayjs from "dayjs";

const POPULAR_ROUTES = [
  "Hà Nội → Đà Nẵng",
  "HCM → Đà Lạt",
  "Hà Nội → HCM",
  "HCM → Nha Trang",
  "Hà Nội → Hải Phòng",
  "HCM → Cần Thơ",
];

const QUICK_ROUTES = [
  { from: "Hà Nội", to: "Đà Nẵng" },
  { from: "HCM", to: "Đà Lạt" },
  { from: "Hà Nội", to: "Vinh" },
  { from: "HCM", to: "Vũng Tàu" },
];

export const HeroBanner = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fromOptions = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
  ]
    .filter((c) => c.toLowerCase().includes(from.toLowerCase()) && from)
    .map((c) => ({ value: c, label: c }));

  const toOptions = [
    "Đà Nẵng",
    "Đà Lạt",
    "Nha Trang",
    "Huế",
    "Vinh",
    "Vũng Tàu",
  ]
    .filter((c) => c.toLowerCase().includes(to.toLowerCase()) && to)
    .map((c) => ({ value: c, label: c }));

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const applyQuickRoute = (f: string, t: string) => {
    setFrom(f);
    setTo(t);
  };

  return (
    <section className="hero">
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />

      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">🚀 Đặt vé nhanh · Giá tốt nhất</p>
          <h2 className="hero__title">
            Di chuyển thông minh
            <br />
            <span className="hero__title-accent">cùng GoRide</span>
          </h2>
          <p className="hero__sub">
            Hàng nghìn chuyến xe mỗi ngày. Đặt vé trong 30 giây, hoàn tiền 100%
            nếu huỷ trước 24h.
          </p>

          <div className="hero__stats">
            {[
              { num: "2.3M+", label: "Lượt đặt vé" },
              { num: "850+", label: "Nhà xe" },
              { num: "63", label: "Tỉnh thành" },
            ].map((s) => (
              <div key={s.label} className="hero__stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__search-card">
          <p className="hero__search-label">Tìm chuyến xe</p>

          <div className="hero__search-fields">
            <div className="hero__search-field">
              <span className="hero__field-icon">
                <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
                  <circle
                    cx="8"
                    cy="6"
                    r="3"
                    stroke="#f5a623"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M8 14s5-4.5 5-8A5 5 0 003 6c0 3.5 5 8 5 8z"
                    stroke="#f5a623"
                    strokeWidth="1.4"
                  />
                </svg>
              </span>
              <AutoComplete
                value={from}
                options={fromOptions}
                onChange={setFrom}
                className="hero__autocomplete"
                placeholder="Điểm đi"
                popupMatchSelectWidth={false}
              />
            </div>

            {/* Swap */}
            <button
              className="hero__swap-btn"
              onClick={handleSwap}
              title="Đổi chiều"
            >
              <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
                <path
                  d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* To */}
            <div className="hero__search-field">
              <span className="hero__field-icon">
                <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
                  <path
                    d="M8 2v10M5 9l3 3 3-3"
                    stroke="#f5a623"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="13" r="1" fill="#f5a623" />
                </svg>
              </span>
              <AutoComplete
                value={to}
                options={toOptions}
                onChange={setTo}
                className="hero__autocomplete"
                placeholder="Điểm đến"
                popupMatchSelectWidth={false}
              />
            </div>
          </div>

          {/* Date */}
          <DatePicker
            className="hero__datepicker"
            placeholder="Chọn ngày đi"
            format="DD/MM/YYYY"
            disabledDate={(d) => d.isBefore(dayjs().startOf("day"))}
            suffixIcon={
              <svg viewBox="0 0 16 16" fill="none" width={13} height={13}>
                <rect
                  x="2"
                  y="3"
                  width="12"
                  height="11"
                  rx="2"
                  stroke="#9ca3af"
                  strokeWidth="1.3"
                />
                <path
                  d="M5 1v3M11 1v3M2 7h12"
                  stroke="#9ca3af"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            }
          />

          <Button type="primary" block className="hero__search-btn">
            Tìm chuyến xe
          </Button>

          {/* Quick routes */}
          <div className="hero__quick">
            <span className="hero__quick-label">Tuyến phổ biến:</span>
            <div className="hero__quick-tags">
              {QUICK_ROUTES.map((r) => (
                <button
                  key={`${r.from}-${r.to}`}
                  className="hero__quick-tag"
                  onClick={() => applyQuickRoute(r.from, r.to)}
                >
                  {r.from} → {r.to}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular routes ticker */}
      <div className="hero__ticker">
        <span className="hero__ticker-label">🔥 Đang hot:</span>
        <div className="hero__ticker-track">
          {[...POPULAR_ROUTES, ...POPULAR_ROUTES].map((r, i) => (
            <span key={i} className="hero__ticker-item">
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
