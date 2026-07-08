import { CheckCircleFilled } from "@ant-design/icons";
import "./MethodCard.scss";
import type { MethodOption } from "@/common/constants/profile.constant";

interface MethodCardProps {
  option: MethodOption;
  isActive: boolean;
  onClick: () => void;
}

export const MethodCard = ({
  option,
  isActive,
  onClick,
}: MethodCardProps) => (
  <button
    type="button"
    className={`pp-method-card${isActive ? " pp-method-card--active" : ""}`}
    onClick={onClick}
    aria-pressed={isActive}
  >
    <span className="pp-method-card__icon">{option.icon}</span>
    <div className="pp-method-card__text">
      <span className="pp-method-card__label">{option.label}</span>
      <span className="pp-method-card__desc">{option.desc}</span>
    </div>
    {isActive && <CheckCircleFilled className="pp-method-card__check" />}
  </button>
);
