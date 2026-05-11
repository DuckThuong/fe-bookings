import { InputPhoneNumber } from "@pages/auth/component/InputPhoneNumber";
import { Checkbox, Form, Input, type FormInstance } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../style.scss";
import profileIcn from "@/assets/icons/profile.svg";
import { ROUTER_PATH } from "@/routers/Route";
interface SignInProps {
  form: FormInstance;
}

export const Step1 = (props: SignInProps) => {
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  return (
    <>
      <div className="signin-header">
        <p className="signin-header__eyebrow">
          Bước 1 / 3 — Thông tin tài khoản
        </p>
      </div>
      <div className="signin-form">
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên của bạn" }]}
        >
          <Input
            type="text"
            size="large"
            placeholder="Nhập họ và tên của bạn"
            prefix={
              <img
                src={profileIcn}
                alt="profile icon"
                style={{ width: 16, height: 16, marginRight: 8 }}
              />
            }
          />
        </Form.Item>

        <InputPhoneNumber
          value={props.form.getFieldValue("phone")}
          onChange={(value) => props.form.setFieldValue("phone", value)}
          onBlur={(value) => props.form.setFieldValue("phone", value)}
        />
      </div>
      <Form.Item
        name="acceptRole"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("Bạn cần đồng ý điều khoản")),
          },
        ]}
        className="signin-terms-form"
      >
        <Checkbox className="signin-terms-checkbox">
          <span className="signin-terms__text">
            Tôi đồng ý với{" "}
            <Link to={ROUTER_PATH.SUPPORT}>Điều khoản sử dụng</Link> và{" "}
            <Link to={ROUTER_PATH.SUPPORT}>Chính sách bảo mật</Link> của GoRide.
            Thông tin của bạn được bảo vệ theo tiêu chuẩn cao nhất.
          </span>
        </Checkbox>
      </Form.Item>
    </>
  );
};
