import { useState } from "react";
import { Button, Checkbox, Form, Input, Radio, Typography } from "antd";
import "./style.scss";

const { Title, Paragraph } = Typography;

const PAYMENT_OPTIONS = [
  { label: "Thẻ", value: "card" },
  { label: "Chuyển khoản", value: "bank" },
  { label: "Tiền mặt", value: "cash" },
];

export const ProfilePayment = () => {
  const [form] = Form.useForm();
  const [selectedMethods, setSelectedMethods] = useState<string[]>(["card"]);

  const handleMethodsChange = (values: string[]) => {
    setSelectedMethods(values);
  };

  const handleFinish = (values: any) => {
    console.log("Payment updated", values);
  };

  return (
    <div className="profile-payment">
      <div className="profile-payment__header">
        <Title className="profile-payment__title">
          Cập nhật phương thức thanh toán
        </Title>
        <Paragraph className="profile-payment__description">
          Chọn loại thanh toán phù hợp nhất với bạn: tiền mặt, chuyển khoản hoặc
          thẻ.
        </Paragraph>
      </div>

      <div className="profile-payment__body">
        <section className="profile-payment__panel">
          <div className="profile-payment__current-card">
            <div className="profile-payment__card-row">
              <span>Phương thức hiện tại</span>
              <strong>
                {selectedMethods.length > 0
                  ? selectedMethods
                      .map((method) =>
                        method === "card"
                          ? "Thẻ"
                          : method === "bank"
                            ? "Chuyển khoản"
                            : "Tiền mặt",
                      )
                      .join(", ")
                  : "Chưa chọn phương thức nào"}
              </strong>
            </div>
            {selectedMethods.includes("card") && (
              <>
                <div className="profile-payment__card-row">
                  <span>Loại thẻ</span>
                  <strong>Visa</strong>
                </div>
                <div className="profile-payment__card-row">
                  <span>Số thẻ</span>
                  <strong>**** 1234</strong>
                </div>
              </>
            )}
            {selectedMethods.includes("bank") && (
              <>
                <div className="profile-payment__card-row">
                  <span>Ngân hàng</span>
                  <strong>Vietcombank</strong>
                </div>
                <div className="profile-payment__card-row">
                  <span>Số tài khoản</span>
                  <strong>0123 456 789</strong>
                </div>
              </>
            )}
            {selectedMethods.includes("cash") && (
              <div className="profile-payment__card-row">
                <span>Ghi chú</span>
                <strong>Thanh toán khi nhận vé tại quầy</strong>
              </div>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            className="profile-payment__form"
            onFinish={handleFinish}
          >
            <Form.Item
              label="Phương thức thanh toán"
              name="paymentMethods"
              initialValue={["card"]}
              rules={[
                {
                  required: true,
                  type: "array",
                  min: 1,
                  message: "Chọn ít nhất một phương thức thanh toán",
                },
              ]}
            >
              <Checkbox.Group
                options={PAYMENT_OPTIONS}
                value={selectedMethods}
                onChange={handleMethodsChange}
              />
            </Form.Item>

            {selectedMethods.includes("card") && (
              <>
                <Form.Item
                  label="Loại thẻ"
                  name="cardType"
                  initialValue="visa"
                  rules={
                    selectedMethods.includes("card")
                      ? [{ required: true, message: "Chọn loại thẻ" }]
                      : []
                  }
                >
                  <Radio.Group>
                    <Radio value="visa">Visa</Radio>
                    <Radio value="mastercard">Mastercard</Radio>
                    <Radio value="jcb">JCB</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="Số thẻ"
                  name="cardNumber"
                  rules={
                    selectedMethods.includes("card")
                      ? [
                          { required: true, message: "Nhập số thẻ" },
                          {
                            pattern: /^\d{13,19}$/,
                            message: "Số thẻ phải có 13-19 chữ số",
                          },
                        ]
                      : []
                  }
                >
                  <Input placeholder="0000 0000 0000 0000" />
                </Form.Item>

                <div className="profile-payment__grid">
                  <Form.Item
                    label="Ngày hết hạn"
                    name="expiry"
                    rules={
                      selectedMethods.includes("card")
                        ? [{ required: true, message: "Nhập ngày hết hạn" }]
                        : []
                    }
                  >
                    <Input placeholder="MM/YY" />
                  </Form.Item>

                  <Form.Item
                    label="CVV"
                    name="cvv"
                    rules={
                      selectedMethods.includes("card")
                        ? [
                            { required: true, message: "Nhập CVV" },
                            {
                              pattern: /^\d{3,4}$/,
                              message: "CVV không hợp lệ",
                            },
                          ]
                        : []
                    }
                  >
                    <Input placeholder="123" />
                  </Form.Item>
                </div>
              </>
            )}

            {selectedMethods.includes("bank") && (
              <>
                <div className="profile-payment__method-section-title">
                  Thông tin chuyển khoản
                </div>
                <Form.Item
                  label="Ngân hàng"
                  name="bankName"
                  rules={
                    selectedMethods.includes("bank")
                      ? [{ required: true, message: "Nhập tên ngân hàng" }]
                      : []
                  }
                >
                  <Input placeholder="VD: Vietcombank" />
                </Form.Item>

                <Form.Item
                  label="Số tài khoản"
                  name="bankAccount"
                  rules={
                    selectedMethods.includes("bank")
                      ? [
                          { required: true, message: "Nhập số tài khoản" },
                          {
                            pattern: /^\d{8,20}$/,
                            message: "Số tài khoản không hợp lệ",
                          },
                        ]
                      : []
                  }
                >
                  <Input placeholder="0123456789" />
                </Form.Item>

                <Form.Item
                  label="Tên chủ tài khoản"
                  name="accountHolder"
                  rules={
                    selectedMethods.includes("bank")
                      ? [{ required: true, message: "Nhập tên chủ tài khoản" }]
                      : []
                  }
                >
                  <Input placeholder="Nguyen Van A" />
                </Form.Item>
              </>
            )}

            {selectedMethods.includes("cash") && (
              <div className="profile-payment__cash-note">
                Hệ thống sẽ lưu lựa chọn thanh toán tiền mặt. Bạn sẽ thanh toán
                trực tiếp tại quầy khi đến nhận vé.
              </div>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Lưu phương thức thanh toán
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    </div>
  );
};
