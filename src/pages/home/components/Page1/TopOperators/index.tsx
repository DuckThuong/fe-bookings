import type { HomeTopOperator } from "@/common/types/home";
import { ROUTER_PATH } from "@/routers/Route";
import { Button, Rate, Typography } from "antd";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  data: HomeTopOperator[];
}

const parseReviewCount = (raw: string): number => {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return 0;
  const match = trimmed.match(/^([\d.,]+)\s*([kKmM]?)/);
  if (!match) return 0;
  const value = Number(match[1].replace(/[.,]/g, "."));
  if (Number.isNaN(value)) return 0;
  const unit = match[2]?.toLowerCase();
  if (unit === "k") return value * 1000;
  if (unit === "m") return value * 1_000_000;
  return value;
};

export const TopOperators = ({ data }: HomeProps) => {
  const navigate = useNavigate();

  const handleOpenOperator = (op: HomeTopOperator) => {
    navigate(ROUTER_PATH.TRIP, {
      state: {
        companyId: op.id,
        companyName: op.name,
      },
    });
  };

  return (
    <section className="section operator-section">
      <div className="section__head">
        <h3 className="section__title">Nhà xe nổi bật</h3>
        <Typography.Link className="section__more">Tất cả nhà xe →</Typography.Link>
      </div>

      <div className="operator-list">
        {data.map((op, idx) => {
          const reviewNumber = parseReviewCount(op.reviewCount);
          return (
            <Button
              key={op.id}
              className="operator-card"
              type="text"
              onClick={() => handleOpenOperator(op)}
            >
              <span
                className={`operator-card__rank${idx < 3 ? " operator-card__rank--top" : ""}`}
              >
                #{idx + 1}
              </span>

              <div
                className="operator-card__logo"
                style={{ background: op.logoColor ?? "#0a0e1a" }}
              >
                {op.shortName}
              </div>

              <div className="operator-card__info">
                <div className="operator-card__name-row">
                  <span className="operator-card__name">{op.name}</span>
                  <span className="operator-card__badge">
                    {op.totalTickets.toLocaleString("vi-VN")} vé đã bán
                  </span>
                </div>
                <div className="operator-card__rating-row">
                  <Rate
                    disabled
                    defaultValue={op.rating}
                    allowHalf
                    className="operator-card__stars"
                  />
                  <span className="operator-card__rating-val">{op.rating}</span>
                  <span className="operator-card__reviews">
                    ({reviewNumber >= 1000
                      ? `${(reviewNumber / 1000).toFixed(1)}k`
                      : reviewNumber}{" "}
                    đánh giá)
                  </span>
                </div>
                <p className="operator-card__routes">
                  📍 {op.activeTrips} chuyến đang hoạt động
                </p>
              </div>

              <span className="operator-card__arrow">›</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
};
