import { useState } from "react";
import { AutoComplete, Button, DatePicker } from "antd";
import dayjs from "dayjs";
import pinnedIcn from "@/assets/icons/pinned.svg";
import swapIcn from "@/assets/icons/swap.svg";
import arrowDownIcn from "@/assets/icons/arrowDown.svg";
import datePickerIcn from "@/assets/icons/datePicker.svg";

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
                <img src={pinnedIcn} alt="From" width={14} height={14} />
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
              <img src={swapIcn} alt="Swap" width={14} height={14} />
            </button>

            {/* To */}
            <div className="hero__search-field">
              <span className="hero__field-icon">
                <img src={arrowDownIcn} alt="To" width={14} height={14} />
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
              <img src={datePickerIcn} alt="Date" width={14} height={14} />
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
