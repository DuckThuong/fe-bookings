import { Button, Form, Input } from "antd";
import { CreditCardOutlined, LockOutlined } from "@ant-design/icons";
import { CardPreview } from "./CardPreview";
import "./CardForm.scss";
import { CARD_NETWORKS, type CardNetwork } from "@/common/constants/profile.constant";

interface CardFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

export const CardForm = ({ form }: CardFormProps) => {
  const network = (Form.useWatch("cardNetwork", form) as CardNetwork) ?? "visa";
  const number = (Form.useWatch("cardNumber", form) as string) ?? "";
  const expiry = (Form.useWatch("expiry", form) as string) ?? "";

  return (
    <div className="pp-form-section">
      <CardPreview network={network as CardNetwork} number={number} expiry={expiry} />

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
