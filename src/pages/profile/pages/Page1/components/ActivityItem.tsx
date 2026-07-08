import { Tag } from "antd";
import "./ActivityItem.scss";

interface ActivityItemProps {
  icon: string;
  title: string;
  meta: string;
  status: string;
}

export const ActivityItem = ({ icon, title, meta, status }: ActivityItemProps) => (
  <div className="ps-trip">
    <div className="ps-trip__icon">
      <i className={`ti ${icon}`} aria-hidden="true" />
    </div>
    <div className="ps-trip__body">
      <div className="ps-trip__title">{title}</div>
      <div className="ps-trip__meta">
        <span className="ps-trip__note">{meta}</span>
      </div>
    </div>
    <Tag className={`ps-trip__tag ps-trip__tag--${status}`} bordered={false}>
      {status}
    </Tag>
    <i className="ti ti-chevron-right ps-trip__chevron" aria-hidden="true" />
  </div>
);
