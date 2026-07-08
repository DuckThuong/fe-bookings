import { Form, Input } from "antd";
import { BankOutlined, CreditCardOutlined } from "@ant-design/icons";
import "./BankForm.scss";

export const BankForm = () => (
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
