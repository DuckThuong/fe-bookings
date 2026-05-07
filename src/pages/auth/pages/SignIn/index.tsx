import { BENEFITS } from "@/common/constants/constants";
import "./style.scss";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { Button, Form, Steps } from "antd";
import { Step1 } from "./steps/Step1";
import { Step3 } from "./steps/Step3";
import { Step2 } from "./steps/Step2";
import type { SignInDto } from "@api/dtos/SignIn.dto";

export const SignIn = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SignInDto>(null);
  const contentRender = () => {
    switch (step) {
      case 0:
        return <Step1 form={form} />;
      case 1:
        return <Step2 form={form} />;
      case 2:
        return <Step3 form={form} />;
      default:
        return <Step1 form={form} />;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();

      if (step < 2) {
        const currentValues = form.getFieldsValue();
        setData((prev) => ({ ...prev, ...currentValues }));
        setStep((v) => v + 1);
      } else {
        const finalData: SignInDto = {
          ...data,
          ...form.getFieldsValue(),
        };
        setData(finalData);
        console.log("Submit:", finalData);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  return (
    <div className="auth-signin">
      {/* Logo */}
      <div className="signin-logo">
        <Logo />
      </div>
      <div className="signin-card">
        <Steps
          current={step}
          items={[
            {
              title: "Tài Khoản",
            },
            {
              title: "Thông Tin Cá Nhân",
            },
            {
              title: "Xác Minh",
            },
          ]}
        />
        <div className="signin-content">
          <div className="signin-header__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#f5a623" strokeWidth="1.5" />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="#f5a623"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="signin-header__title">
            Cho chúng tôi
            <br />
            biết về bạn
          </h1>
          <p className="signin-header__sub">
            Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để tạo tài khoản
            GoRide. Bạn vui lòng đảm bảo rằng thông tin bạn cung cấp là chính
            xác và cập nhật để trải nghiệm dịch vụ tốt nhất.
          </p>
          <Form form={form} layout="vertical">
            {contentRender()}
          </Form>
        </div>
        <Button loading={loading} className="signin-btn" onClick={handleSubmit}>
          Tạo tài khoản
        </Button>

        <p className="signin-login-link">
          Đã có tài khoản?{" "}
          <a href="/login" className="signin-login-link__a">
            Đăng nhập ngay
          </a>
        </p>
        <div className="signin-benefits">
          {BENEFITS.map((b, i) => (
            <div key={i} className="signin-benefits__item">
              <div className="signin-benefits__icon">{b.icon}</div>
              <span className="signin-benefits__text">
                {b.text.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j === 0 && <br />}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
