import { useState } from "react";
import "../style.scss";
import { Form, Input } from "antd";

export const Step1 = () => {
  const [form] = Form.useForm();
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  return (
    <>
      <div className="signin-header">
        <p className="signin-header__eyebrow">
          Bước 1 / 3 — Thông tin tài khoản
        </p>
      </div>
      <Form form={form} layout="vertical" className="signin-form">
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên của bạn" }]}
        >
          <Input type="text" placeholder="Nhập họ và tên của bạn" />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="dob"
          rules={[
            { required: true, message: "Vui lòng chọn ngày sinh của bạn" },
          ]}
        >
          <Input type="date" placeholder="Chọn ngày sinh của bạn" />
        </Form.Item>
      </Form>
      <div className="signin-terms">
        <div
          className={`signin-terms__check ${termsAccepted ? "signin-terms__check--checked" : ""}`}
          onClick={() => setTermsAccepted((v) => !v)}
        >
          <svg viewBox="0 0 11 11" fill="none">
            <path
              d="M1.5 5.5l3 3 5-5"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="signin-terms__text">
          Tôi đồng ý với <a href="/terms">Điều khoản sử dụng</a> và{" "}
          <a href="/privacy">Chính sách bảo mật</a> của GoRide. Thông tin của
          bạn được bảo vệ theo tiêu chuẩn cao nhất.
        </p>
      </div>
    </>
  );
};
