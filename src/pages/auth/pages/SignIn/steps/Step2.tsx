import { useState } from "react";
import "../style.scss";
import { DatePicker, Form, Input, type FormInstance } from "antd";
import { InputPhoneNumber } from "@pages/auth/component/InputPhoneNumber";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                id="mail"
              >
                <g
                  fill="none"
                  fill-rule="evenodd"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="M3 1h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2z" />
                  <path d="m21 3-10 7L1 3" />
                </g>
              </svg>
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
                <label className="signin-field__label">
                    Giới tính
                </label>

                <div className="signin-gender">
                    {genderList?.map((opt) => (
                        <div
                            key={opt.value}
                            className={`signin-gender__opt ${
                                gender === opt.value
                                    ? "signin-gender__opt--selected"
                                    : ""
                            }`}
                            onClick={() => {
                                setGender(opt.value);
                                props.form.setFieldValue(
                                    "gender",
                                    opt.value,
                                );
                            }}
                        >
                            <div className="signin-gender__radio">
                                <div className="signin-gender__dot" />
                            </div>

                            <span className="signin-gender__emoji">
                        {opt.emoji}
                    </span>

                            <span className="signin-gender__text">
                        {opt.label}
                    </span>
                        </div>
                    ))}
                </div>
            </div>
        </Form.Item>
    </div>
  );
};
