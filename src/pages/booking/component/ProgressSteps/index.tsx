import { STEPS } from "../../constants/booking.constants";

const ProgressSteps = ({ activeIdx }: { activeIdx: number }) => (
  <div className="confirm-progress">
    <div className="confirm-steps">
      {STEPS.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div
            key={s.label}
            className={[
              "confirm-step",
              done && "confirm-step--done",
              active && "confirm-step--active",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="confirm-step__dot">{done ? "✓" : i + 1}</div>
            <span className="confirm-step__label">{s.label}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default ProgressSteps;
