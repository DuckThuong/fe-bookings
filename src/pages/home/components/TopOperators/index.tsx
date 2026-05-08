import { LOGO_OPERATORS_COLORS } from "@/common/constants/constants";
import { Rate } from "antd";

interface HomeProps {
  data: any;
}
export const TopOperators = ({ data }: HomeProps) => {
  return (
    <section className="section operator-section">
      <div className="section__head">
        <h3 className="section__title">Nhà xe nổi bật</h3>
        <a className="section__more">Tất cả nhà xe →</a>
      </div>

      <div className="operator-list">
        {data.map((op: any, idx: number) => (
          <button key={op.id} className="operator-card">
            <span
              className={`operator-card__rank${idx < 3 ? " operator-card__rank--top" : ""}`}
            >
              #{idx + 1}
            </span>

            <div
              className="operator-card__logo"
              style={{
                background: LOGO_OPERATORS_COLORS[op.logo] ?? "#0a0e1a",
              }}
            >
              {op.logo}
            </div>

            <div className="operator-card__info">
              <div className="operator-card__name-row">
                <span className="operator-card__name">{op.name}</span>
                {op.badge && (
                  <span className="operator-card__badge">{op.badge}</span>
                )}
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
                  ({(op.reviews / 1000).toFixed(1)}k đánh giá)
                </span>
              </div>
              <p className="operator-card__routes">📍 {op.routes}</p>
            </div>

            <span className="operator-card__arrow">›</span>
          </button>
        ))}
      </div>
    </section>
  );
};
