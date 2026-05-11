import { TAG_COLORS } from "@/common/constants/constants";

interface HomeProps {
  data: any;
}

export const ServiceGrid = ({ data }: HomeProps) => {
  return (
    <section className="section service-section">
      <div className="section__head">
        <h3 className="section__title">Dịch vụ</h3>
        <a className="section__more">Xem tất cả →</a>
      </div>

      <div className="service-grid">
        {data.map((s: any) => (
          <button key={s.id} className="service-card">
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
          </button>
        ))}
      </div>
    </section>
  );
};
