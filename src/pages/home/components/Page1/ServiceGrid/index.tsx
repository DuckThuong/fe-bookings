import { TAG_COLORS } from "@/common/constants/constants";
import { Button, Typography } from "antd";

interface HomeProps {
  data: any;
}

export const ServiceGrid = ({ data }: HomeProps) => {
  return (
    <section className="section service-section">
      <div className="section__head">
        <h3 className="section__title">Dịch vụ</h3>
        <Typography.Link className="section__more">Xem tất cả →</Typography.Link>
      </div>

      <div className="service-grid">
        {data.map((s: any) => (
          <Button key={s.id} className="service-card" type="text">
            {s.tag && (
              <span
                className={`service-card__tag ${TAG_COLORS[s.tagColor ?? "amber"]}`}
              >
                {s.tag}
              </span>
            )}
            <span className="service-card__icon">{s.icon}</span>
            <span className="service-card__label">{s.label}</span>
            <span className="service-card__desc">{s.desc}</span>
          </Button>
        ))}
      </div>
    </section>
  );
};
