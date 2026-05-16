import { useState } from "react";
import { AutoComplete, Button, DatePicker } from "antd";
import dayjs from "dayjs";
import pinnedIcn from "@/assets/icons/pinned.svg";
import swapIcn from "@/assets/icons/swap.svg";
import arrowDownIcn from "@/assets/icons/arrowDown.svg";
import datePickerIcn from "@/assets/icons/datePicker.svg";
import { Banner } from "@/pages/auth/component/Banner";
import { ROUTER_PATH } from "@/routers/Route";
import { useNavigate } from "react-router-dom";
import {
  HOME_CITIES,
  HOME_DESTINATIONS,
  HOME_POPULAR_ROUTES,
  HOME_QUICK_ROUTES,
} from "../../../shared/searchData";

export const HeroBanner = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(dayjs());

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

  const applyQuickRoute = (f: string, t: string) => {
    setFrom(f);
    setTo(t);
  };

  return (
    <section className="hero">
      <div className="hero__animated-banner" aria-hidden="true">
        <Banner />
      </div>
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
            <Button
              className="hero__swap-btn"
              onClick={handleSwap}
              title="Đổi chiều"
              type="text"
            >
              <img src={swapIcn} alt="Swap" width={14} height={14} />
            </Button>

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
            value={date}
            onChange={(d) => d && setDate(d)}
            format="DD/MM/YYYY"
            disabledDate={(d) => d.isBefore(dayjs().startOf("day"))}
            suffixIcon={
              <img src={datePickerIcn} alt="Date" width={14} height={14} />
            }
          />

          <Button
            type="primary"
            block
            className="hero__search-btn"
            onClick={() =>
              navigate(ROUTER_PATH.BOOKING, {
                state: {
                  from: from || "Hà Nội",
                  to: to || "TP. Hồ Chí Minh",
                  date: date.format("DD/MM/YYYY"),
                },
              })
            }
          >
            Tìm chuyến xe
          </Button>

          {/* Quick routes */}
          <div className="hero__quick">
            <span className="hero__quick-label">Tuyến phổ biến:</span>
            <div className="hero__quick-tags">
              {HOME_QUICK_ROUTES.map((r) => (
                <Button
                  key={`${r.from}-${r.to}`}
                  className="hero__quick-tag"
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
      </div>

      {/* Popular routes ticker */}
      <div className="hero__ticker">
        <span className="hero__ticker-label">🔥 Đang hot:</span>
        <div className="hero__ticker-track">
          {[...HOME_POPULAR_ROUTES, ...HOME_POPULAR_ROUTES].map((r, i) => (
            <span key={i} className="hero__ticker-item">
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
