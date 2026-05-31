import { Button, Typography, message } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router";

interface PromoCarouselProps {
  data: any;
}

export const PromoCarousel = ({ data }: PromoCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success(`Đã sao chép mã "${code}"`);
  };

  return (
    <section className="section promo-section">
      <div className="section__head">
        <h3 className="section__title">Khuyến mãi</h3>
        <Typography.Link className="section__more" onClick={() => navigate("/promos")}>
          Tất cả ưu đãi →
        </Typography.Link>
      </div>

      <div className="promo-track" ref={trackRef}>
        {data.map((p: any) => (
          <div
            key={p.id}
            className="promo-card"
            style={{ background: p.bg, color: p.textColor ?? "#fff" }}
          >
            {/* Decorative circle */}
            <div className="promo-card__circle" />

            <div className="promo-card__body">
              <p className="promo-card__discount">{p.discount}</p>
              <h4 className="promo-card__title">{p.title}</h4>
              <p className="promo-card__sub">{p.subtitle}</p>
            </div>

            <div className="promo-card__footer">
              <div className="promo-card__code-wrap">
                <span className="promo-card__code">{p.code}</span>
                <Button
                  size="small"
                  className="promo-card__copy-btn"
                  onClick={() => copyCode(p.code)}
                >
                  Sao chép
                </Button>
              </div>
              <span className="promo-card__expiry">HSD: {p.expiry}</span>
            </div>
          </div>
        ))}

        {/* CTA card */}
        <div className="promo-card promo-card--cta" onClick={() => navigate("/promos")}>
          <span className="promo-card__cta-icon">🎁</span>
          <p className="promo-card__cta-text">
            Xem thêm
            <br />
            ưu đãi
          </p>
          <Typography.Link className="promo-card__cta-link">
            Khám phá →
          </Typography.Link>
        </div>
      </div>
    </section>
  );
};
