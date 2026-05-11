import profileIcn from "@/assets/icons/profile.svg";
import {
  BENEFITS,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@/common/constants/constants";
import { Logo } from "@/components/Logo";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import type { SignInDto } from "@api/dtos/SignIn.dto";
import { Button, Form, Steps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import back from "../../../../assets/icons/back.svg";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import "./style.scss";

const subTitleMap: Record<number, string> = {
  0: "Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để tạo tài khoản GoRide. Bạn vui lòng đảm bảo rằng thông tin bạn cung cấp là chính xác và cập nhật để trải nghiệm dịch vụ tốt nhất.",
  1: "Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để tạo tài khoản GoRide. Bạn vui lòng đảm bảo rằng thông tin bạn cung cấp là chính xác và cập nhật để trải nghiệm dịch vụ tốt nhất.",
  2: "Chúng tôi đã gửi mã xác minh đến số điện thoại của bạn. Vui lòng nhập mã có 4 chữ số để hoàn tất đăng ký. Lưu ý: Mã xác minh có hiệu lực trong vòng 5 phút, hãy kiểm tra hộp thư đến của bạn và nhập mã kịp thời để hoàn tất quá trình đăng ký.",
};

export const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
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
        showNotification(DEFAULT_MESSAGE, NOTI_SUCCESS);
      } else {
        const finalData: SignInDto = {
          ...data,
          ...form.getFieldsValue(),
        };
        showNotification(DEFAULT_MESSAGE, NOTI_SUCCESS);
        setData(finalData);
      }

      if (step === 2) {
        navigate(ROUTER_PATH.FINISH);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      showNotification(DEFAULT_MESSAGE, NOTI_ERROR);
    }
  };

  console.log(data);
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
          <div className="signin-header">
            <div className="signin-header__icon">
              <img src={profileIcn} alt="Profile Icon" />
            </div>
            {step > 0 && (
              <img
                src={back}
                onClick={() => {
                  setStep(step - 1);
                }}
                alt="Back"
                className="back"
              />
            )}
          </div>
          <h1 className="signin-header__title">
            Cho chúng tôi
            <br />
            biết về bạn
          </h1>
          <p id="sub-title" className="signin-header__sub">
            {subTitleMap[step]}
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
          <Link to={ROUTER_PATH.LOGIN} className="signin-login-link__a">
            Đăng nhập ngay
          </Link>
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
