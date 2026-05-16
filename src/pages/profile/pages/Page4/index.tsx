import { useState } from "react";
import { Button, Form, Input, Radio } from "antd";
import {
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined,
  LockOutlined,
  SafetyOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import "./style.scss";

// ─── Types ────────────────────────────────────────────────
type PaymentMethod = "card" | "bank" | "cash";
type CardNetwork = "visa" | "mastercard" | "jcb";

interface MethodOption {
  key: PaymentMethod;
  icon: React.ReactNode;
  label: string;
  desc: string;
}

// ─── Constants ────────────────────────────────────────────
const METHOD_OPTIONS: MethodOption[] = [
  {
    key: "card",
    icon: <CreditCardOutlined />,
    label: "Thẻ ngân hàng",
    desc: "Visa, Mastercard, JCB",
  },
  {
    key: "bank",
    icon: <BankOutlined />,
    label: "Chuyển khoản",
    desc: "Internet banking",
  },
  {
    key: "cash",
    icon: <DollarOutlined />,
    label: "Tiền mặt",
    desc: "Thanh toán tại quầy",
  },
];

const CARD_NETWORKS: { value: CardNetwork; label: string; color: string }[] = [
  { value: "visa", label: "Visa", color: "#1a1f71" },
  { value: "mastercard", label: "Mastercard", color: "#eb001b" },
  { value: "jcb", label: "JCB", color: "#003087" },
];

// ─── Sub: Method selector card ────────────────────────────
const MethodCard = ({
  option,
  isActive,
  onClick,
}: {
  option: MethodOption;
  isActive: boolean;
  onClick: () => void;
}) => (
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

// ─── Sub: Bank card visual preview ───────────────────────
const CardPreview = ({
  network,
  number,
  expiry,
}: {
  network: CardNetwork;
  number: string;
  expiry: string;
}) => {
  const display = number
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
  const masked = display
    ? display.slice(0, -4).replace(/\d/g, "•") + display.slice(-4)
    : "•••• •••• •••• ••••";

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

// ─── Sub: Card form ───────────────────────────────────────
const CardForm = ({ form }: { form: ReturnType<typeof Form.useForm>[0] }) => {
  const network = (Form.useWatch("cardNetwork", form) as CardNetwork) ?? "visa";
  const number = (Form.useWatch("cardNumber", form) as string) ?? "";
  const expiry = (Form.useWatch("expiry", form) as string) ?? "";

  return (
    <div className="pp-form-section">
      <CardPreview network={network} number={number} expiry={expiry} />

      {/* Network radio */}
      <Form.Item
        label="Loại thẻ"
        name="cardNetwork"
        initialValue="visa"
        rules={[{ required: true, message: "Chọn loại thẻ" }]}
      >
        <div className="pp-network-row">
          {CARD_NETWORKS.map((n) => (
            <button
              key={n.value}
              type="button"
              className={`pp-network-btn${network === n.value ? " pp-network-btn--active" : ""}`}
              onClick={() => form.setFieldValue("cardNetwork", n.value)}
              style={
                network === n.value
                  ? { borderColor: n.color, color: n.color }
                  : {}
              }
            >
              {n.label}
            </button>
          ))}
        </div>
      </Form.Item>

      {/* Card number */}
      <Form.Item
        label="Số thẻ"
        name="cardNumber"
        rules={[
          { required: true, message: "Nhập số thẻ" },
          { pattern: /^\d{13,19}$/, message: "Số thẻ phải có 13–19 chữ số" },
        ]}
      >
        <Input
          prefix={<CreditCardOutlined />}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
        />
      </Form.Item>

      <div className="pp-two-col">
        <Form.Item
          label="Ngày hết hạn"
          name="expiry"
          rules={[{ required: true, message: "Nhập ngày hết hạn" }]}
        >
          <Input placeholder="MM / YY" maxLength={5} />
        </Form.Item>

        <Form.Item
          label="CVV"
          name="cvv"
          rules={[
            { required: true, message: "Nhập CVV" },
            { pattern: /^\d{3,4}$/, message: "CVV không hợp lệ" },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            placeholder="•••"
            maxLength={4}
            type="password"
          />
        </Form.Item>
      </div>
    </div>
  );
};

// ─── Sub: Bank transfer form ──────────────────────────────
const BankForm = () => (
  <div className="pp-form-section">
    <Form.Item
      label="Tên ngân hàng"
      name="bankName"
      rules={[{ required: true, message: "Nhập tên ngân hàng" }]}
    >
      <Input prefix={<BankOutlined />} placeholder="Vietcombank, BIDV, MB..." />
    </Form.Item>

    <Form.Item
      label="Số tài khoản"
      name="bankAccount"
      rules={[
        { required: true, message: "Nhập số tài khoản" },
        { pattern: /^\d{8,20}$/, message: "Số tài khoản không hợp lệ" },
      ]}
    >
      <Input prefix={<CreditCardOutlined />} placeholder="0123 456 789" />
    </Form.Item>

    <Form.Item
      label="Tên chủ tài khoản"
      name="accountHolder"
      rules={[{ required: true, message: "Nhập tên chủ tài khoản" }]}
    >
      <Input
        placeholder="NGUYEN VAN A"
        style={{ textTransform: "uppercase" }}
      />
    </Form.Item>
  </div>
);

// ─── Sub: Cash note ───────────────────────────────────────
const CashNote = () => (
  <div className="pp-cash-note">
    <span className="pp-cash-note__icon">💵</span>
    <div>
      <p className="pp-cash-note__title">Thanh toán tiền mặt tại quầy</p>
      <p className="pp-cash-note__desc">
        Hệ thống sẽ giữ chỗ trong 30 phút. Vui lòng đến quầy đúng giờ để hoàn
        tất thanh toán và nhận vé.
      </p>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────
export const ProfilePayment = () => {
  const [form] = Form.useForm();
  const [method, setMethod] = useState<PaymentMethod>("card");

  const handleFinish = (values: unknown) => {
    // TODO: call API to save payment method
    console.log("Payment updated:", values);
  };

  return (
    <div className="profile-payment">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="profile-payment__header">
        <div className="pp-header__text">
          <h2 className="pp-header__title">Phương thức thanh toán</h2>
          <p className="pp-header__desc">
            Chọn và cập nhật phương thức thanh toán cho các chuyến xe.
          </p>
        </div>
        <div className="pp-header__secure">
          <SafetyOutlined />
          <span>Bảo mật SSL 256-bit</span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="profile-payment__body">
        {/* Method selector */}
        <div className="pp-section">
          <p className="pp-section__title">Chọn phương thức</p>
          <div className="pp-method-row">
            {METHOD_OPTIONS.map((opt) => (
              <MethodCard
                key={opt.key}
                option={opt}
                isActive={method === opt.key}
                onClick={() => setMethod(opt.key)}
              />
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="pp-section pp-section--form">
          <p className="pp-section__title">
            {method === "card" && "Thông tin thẻ"}
            {method === "bank" && "Thông tin chuyển khoản"}
            {method === "cash" && "Ghi chú tiền mặt"}
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="pp-form"
          >
            {method === "card" && <CardForm form={form} />}
            {method === "bank" && <BankForm />}
            {method === "cash" && <CashNote />}

            {method !== "cash" && (
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="pp-save-btn"
                >
                  Lưu phương thức thanh toán
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};
