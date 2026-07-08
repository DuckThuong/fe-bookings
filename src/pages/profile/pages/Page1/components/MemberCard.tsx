import { Progress } from "antd";
import "./MemberCard.scss";

type ProfileLikeUser = {
  rank?: string;
  nextRank?: string;
  rankProgressPercent?: number;
};

interface MemberCardProps {
  user: ProfileLikeUser;
}

export const MemberCard = ({ user }: MemberCardProps) => {
  const rank = user.rank ?? "Chưa xếp hạng";
  const nextRank = user.nextRank;
  const progress = user.rankProgressPercent ?? 0;

  return (
    <div className="ps-member">
      <div className="ps-member__top">
        <div className="ps-member__icon">
          <i className="ti ti-crown" aria-hidden="true" />
        </div>
        <div className="ps-member__info">
          <div className="ps-member__tier">Hạng {rank}</div>
          <div className="ps-member__next">
            {nextRank ? `Tiến độ lên ${nextRank}` : "Đã đạt hạng cao nhất"}
          </div>
        </div>
        <div className="ps-member__pct">{progress}%</div>
      </div>
      <div className="ps-member__body">
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={{ from: "#f5a623", to: "#fdc96a" }}
          trailColor="var(--color-background-secondary)"
          size={["100%", 6]}
          className="ps-member__progress"
        />
        <div className="ps-member__labels">
          <span>{rank}</span>
          <span>
            {nextRank
              ? `Còn ${100 - progress}% nữa → ${nextRank}`
              : "Không còn mốc tiếp theo"}
          </span>
        </div>
      </div>
    </div>
  );
};
