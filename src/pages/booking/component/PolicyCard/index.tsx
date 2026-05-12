import { POLICIES } from "@/common/constants/booking";

export const PolicyCard = () => (
  <div className="extras-card">
    <div className="extras-card__hd">
      <i className="ti ti-clipboard-list" aria-hidden="true" />
      <span className="extras-card__title">Chính sách nhà xe</span>
    </div>
    {POLICIES.map((p) => (
      <div key={p.title} className="extras-policy">
        <i className={`ti ti-${p.icon}`} aria-hidden="true" />
        <div className="extras-policy__body">
          <div className="extras-policy__title">
            {p.title}
            <span
              className={`extras-policy__tag extras-policy__tag--${p.tagVariant}`}
            >
              {p.tagLabel}
            </span>
          </div>
          <div className="extras-policy__desc">{p.desc}</div>
        </div>
      </div>
    ))}
  </div>
);
