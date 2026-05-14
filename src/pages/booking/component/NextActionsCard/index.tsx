import type { NextAction } from "../../types/confirm.types";

interface NextActionsCardProps {
  actions: NextAction[];
  onAction?: (prompt: string) => void;
}

const NextActionsCard = ({ actions, onAction }: NextActionsCardProps) => (
  <div className="next-actions">
    <div className="next-actions__hd">
      <i className="ti ti-compass" aria-hidden="true" />
      <span>Bạn muốn làm gì tiếp theo?</span>
    </div>
    <div className="next-actions__grid">
      {actions?.map((action) => (
        <button
          key={action.id}
          className="next-actions__item"
          onClick={() => onAction?.(action.prompt)}
          aria-label={action.label}
        >
          <div className="next-actions__item-icon">
            <i className={`ti ${action.icon}`} aria-hidden="true" />
          </div>
          <div className="next-actions__item-label">{action.label}</div>
          <div className="next-actions__item-desc">{action.desc}</div>
        </button>
      ))}
    </div>
  </div>
);

export default NextActionsCard;
