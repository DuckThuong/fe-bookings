import { DatePicker, Form, Input, type FormInstance } from "antd";
import { useState } from "react";
import "../style.scss";
import mailIcn from "@/assets/icons/mail.svg";
interface SignInProps {
  form: FormInstance;
}

export const Step2 = (props: SignInProps) => {
  const [gender, setGender] = useState<string>("");

  const genderList = [
    { value: "male", emoji: "👨", label: "Nam" },
    { value: "female", emoji: "👩", label: "Nữ" },
    { value: "other", emoji: "🧑", label: "Khác" },
  ];
  return (
    <div className="signIn__step-2">
      <div className="signin-header">
        <p className="signin-header__eyebrow">Bước 2 / 3 — Thông tin cá nhân</p>
      </div>

      <div className="signin-form">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ email của bạn" },
          ]}
        >
          <Input
            type="text"
            size="large"
            placeholder="Nhập địa chỉ email của bạn"
            prefix={
              <img
                src={mailIcn}
                alt="mail icon"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            }
          />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="dateOfBirth"
          rules={[
            { required: true, message: "Vui lòng nhập ngày sinh của bạn" },
          ]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>
      </div>

      <Form.Item
        name="gender"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn giới tính",
          },
        ]}
      >
        <div className="signin-field">
          <label className="signin-field__label">Giới tính</label>

          <div className="signin-gender">
            {genderList?.map((opt) => (
              <div
                key={opt.value}
                className={`signin-gender__opt ${
                  gender === opt.value ? "signin-gender__opt--selected" : ""
                }`}
                onClick={() => {
                  setGender(opt.value);
                  props.form.setFieldValue("gender", opt.value);
                }}
              >
                <div className="signin-gender__radio">
                  <div className="signin-gender__dot" />
                </div>

                <span className="signin-gender__emoji">{opt.emoji}</span>

                <span className="signin-gender__text">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Form.Item>
    </div>
  );
};
