import type { CardNetwork } from "@/common/constants/profile.constant";
import "./CardPreview.scss";
import { formatCardNumber } from "@/common/utils/profile.utils";

interface CardPreviewProps {
  network: CardNetwork;
  number: string;
  expiry: string;
}

export const CardPreview = ({ network, number, expiry }: CardPreviewProps) => {
  const masked = formatCardNumber(number);

  return (
    <div className="pp-card-preview">
      <div className="pp-card-preview__top">
        <span className="pp-card-preview__chip" aria-hidden="true" />
        <span className="pp-card-preview__network">
          {network.toUpperCase()}
        </span>
      </div>
      <div className="pp-card-preview__number">{masked}</div>
      <div className="pp-card-preview__bottom">
        <div>
          <p className="pp-card-preview__label">Hết hạn</p>
          <p className="pp-card-preview__value">{expiry || "MM / YY"}</p>
        </div>
      </div>
    </div>
  );
};
