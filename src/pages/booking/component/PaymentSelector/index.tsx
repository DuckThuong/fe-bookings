import type { PaymentMethod } from "../../types/confirm.types";

const PaymentSelector = ({
  selected,
  onChange,
  methods,
}: {
  selected: string;
  onChange: (id: string) => void;
  methods: PaymentMethod[];
}) => (
  <div className="confirm-pay-methods">
    {methods.map((m) => (
      <div
        key={m.id}
        className={`confirm-pay-opt${
          selected === m.id ? " confirm-pay-opt--sel" : ""
        }`}
        onClick={() => onChange(m.id)}
      >
        <div className="confirm-pay-radio">
          <div className="confirm-pay-radio-dot" />
        </div>
        <div
          className="confirm-pay-icon"
          style={m.iconBg ? { background: m.iconBg } : undefined}
        >
          <i
            className={`ti ${m.icon}`}
            style={{ color: m.iconColor }}
            aria-hidden="true"
          />
        </div>
        <div>
          <div className="confirm-pay-name">{m.name}</div>
          <div className="confirm-pay-desc">{m.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

export default PaymentSelector;
