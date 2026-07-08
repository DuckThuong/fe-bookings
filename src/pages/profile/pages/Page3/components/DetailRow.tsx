import "./DetailRow.scss";

interface DetailRowProps {
  label: string;
  value: string;
}

export const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="pt-detail-row">
    <span className="pt-detail-row__label">{label}</span>
    <span className="pt-detail-row__value">{value}</span>
  </div>
);
