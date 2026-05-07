import { formatPhone } from "@/common/contexts/format";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { InputPhoneNumber } from "../../component/InputPhoneNumber";
import "./style.scss";
import { InputState } from "./../../../../common/constants/constants";
import { ROUTER_PATH } from "@/routers/Route";
import { Button } from "antd";

export const Login = () => {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string>(InputState.idle);
  const [loading, setLoading] = useState(false);
  const rawDigits = phone.replace(/\s/g, "");
  const isValid = rawDigits.length === 10;

  const handleSubmit = () => {
    if (!isValid) {
      setStatus(InputState.error);
      return;
    }
    setStatus(InputState.loading);
    setTimeout(() => setStatus(InputState.success), 1800);
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

        <InputPhoneNumber
          value={phone}
          onChange={(value) => setPhone(value)}
          onBlur={(value) => setPhone(value)}
        />

        <Button className={`signin-btn`} onClick={handleSubmit}>
          Tạo tài khoản
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
            <svg viewBox="0 0 18 18" className="login-social__icon">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.075 17.64 11.767 17.64 9.2z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.826.957 4.039l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button className="login-social__btn" type="button">
            <svg viewBox="0 0 18 18" className="login-social__icon">
              <rect width="18" height="18" rx="4" fill="#1877F2" />
              <path
                d="M12.5 9H10.5V15H8V9H6.5V6.75H8V5.5C8 4.12 8.62 3 10.5 3H12V5.25H10.75C10.34 5.25 10.5 5.43 10.5 5.75V6.75H12L12.5 9Z"
                fill="white"
              />
            </svg>
            Facebook
          </button>
          <button className="login-social__btn" type="button">
            <svg viewBox="0 0 18 18" className="login-social__icon" fill="none">
              <path
                d="M13.5 9.5c0-2.5 2-3.7 2.1-3.8C14.4 4 13 3.8 12.5 3.8c-1.2-.1-2.4.7-3 .7-.6 0-1.5-.7-2.5-.7C5.5 3.8 4 4.8 3.2 6.3c-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.3 2.8 2.3 1.1 0 1.6-.7 2.9-.7 1.4 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.9-1.3 1.2-2.5 1.2-2.6-.1-.1-2.3-.9-2.3-3.6z"
                fill="#111"
              />
              <path
                d="M11.5 2.2c.6-.8 1-1.8.9-2.9-.9.1-1.9.6-2.6 1.4-.5.6-1 1.6-.9 2.6.9.1 1.9-.5 2.6-1.1z"
                fill="#111"
              />
            </svg>
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
