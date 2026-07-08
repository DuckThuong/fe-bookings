import { useState } from "react";
import { Button, Form } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { METHOD_OPTIONS, PaymentMethod } from "../../../../common/constants/profile.constant";
import { MethodCard, CardForm, BankForm, CashNote } from "./components";
import "./style.scss";

export const ProfilePayment = () => {
  const [form] = Form.useForm();
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CARD);

  const handleFinish = (values: unknown) => {
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
