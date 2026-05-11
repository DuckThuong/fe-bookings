import { formatPhone } from "@/common/contexts/format";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { InputPhoneNumber } from "../../component/InputPhoneNumber";
import "./style.scss";
import { InputState } from "./../../../../common/constants/constants";
import { ROUTER_PATH } from "@/routers/Route";
import { Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import googleIcn from "@/assets/icons/google.svg";
import facebookIcn from "@/assets/icons/facebook.svg";
import appleIcn from "@/assets/icons/apple.svg";

export const Login = () => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string>(InputState.idle);
  const [loading, setLoading] = useState(false);
  const rawDigits = phone.replace(/\s/g, "");
  const isValid = rawDigits.length === 10;
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!isValid) {
      setStatus(InputState.error);
      return;
    }
    setStatus(InputState.loading);
    setTimeout(() => setStatus(InputState.success), 1800);
    navigate(ROUTER_PATH.OTP_CONFIRM);
  };

  return (
    <div className="auth-login">
      <div className="login-logo">
        <Logo />
      </div>

      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__icon">
            <svg viewBox="0 0 26 26" fill="none">
              <rect
                x="5"
                y="2"
                width="16"
                height="22"
                rx="3"
                fill="#f5a623"
                fillOpacity="0.15"
              />
              <rect
                x="5"
                y="2"
                width="16"
                height="22"
                rx="3"
                stroke="#f5a623"
                strokeWidth="1.5"
              />
              <circle cx="13" cy="20" r="1.5" fill="#f5a623" />
              <rect
                x="9"
                y="5"
                width="8"
                height="1.5"
                rx="0.75"
                fill="#f5a623"
                fillOpacity="0.5"
              />
            </svg>
          </div>
          <p className="login-card__eyebrow">Xác thực tài khoản</p>
          <h1 className="login-card__title">
            Nhập số điện
            <br />
            thoại của bạn
          </h1>
          <p className="login-card__sub">
            Chúng tôi sẽ gửi mã OTP để xác nhận danh tính và bảo vệ tài khoản
            của bạn.
          </p>
        </div>

        <Form form={form} layout="vertical" className="login-form">
          <InputPhoneNumber
            value={phone}
            onChange={(value) => setPhone(value)}
            onBlur={(value) => setPhone(value)}
          />
        </Form>

        <Button className={`signin-btn`} onClick={handleSubmit}>
          Đăng nhập
          <span className="arrow">
            {loading ? <span className="signin-btn__spinner" /> : " →"}
          </span>
        </Button>

        <div className="login-divider">
          <span className="login-divider__line" />
          <span className="login-divider__text">Hoặc tiếp tục với</span>
          <span className="login-divider__line" />
        </div>

        <div className="login-social">
          <button className="login-social__btn" type="button">
            <img src={googleIcn} alt="Google" className="login-social__icon" />
            Google
          </button>
          <button className="login-social__btn" type="button">
            <img
              src={facebookIcn}
              alt="Facebook"
              className="login-social__icon"
            />
            Facebook
          </button>
          <button className="login-social__btn" type="button">
            <img src={appleIcn} alt="Apple" className="login-social__icon" />
            Apple
          </button>
        </div>

        <p className="login-footer">
          Chưa có tài khoản?
          <a href={ROUTER_PATH.SIGNIN} className="login-footer__link">
            Đăng ký ngay
          </a>
        </p>
      </div>

      <div className="login-trust">
        <div className="login-trust__item">
          <span className="login-trust__num">2M+</span>
          <span className="login-trust__label">Chuyến xe</span>
        </div>
        <div className="login-trust__sep" />
        <div className="login-trust__item">
          <span className="login-trust__num">500K</span>
          <span className="login-trust__label">Người dùng</span>
        </div>
        <div className="login-trust__sep" />
        <div className="login-trust__item">
          <span className="login-trust__num">4.9★</span>
          <span className="login-trust__label">Đánh giá</span>
        </div>
      </div>
    </div>
  );
};
