import { signUp } from "@/api/configs/auth.config";
import type { SignUpPayloadDto } from "@/api/dtos/auth.dto";
import profileIcn from "@/assets/icons/profile.svg";
import {
  BENEFITS,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
  SUCCESS_MESSAGE,
} from "@/common/constants/constants";
import { Logo } from "@/components/Logo";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Steps } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
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
  2: "Kiểm tra lại thông tin bạn đã nhập. Nếu có sai sót, bấm Sửa để quay lại bước tương ứng trước khi tạo tài khoản.",
};

const STEP1_FIELDS = [
  "name",
  "phone",
  "password",
  "confirm_password",
  "acceptRole",
] as const;

const STEP2_FIELDS = ["email", "dateOfBirth", "gender"] as const;

const buildSignUpPayload = (
  values: Record<string, unknown>,
): SignUpPayloadDto => ({
  name: String(values.name ?? ""),
  phone: String(values.phone ?? ""),
  password: String(values.password ?? ""),
  confirm_password: String(values.confirm_password ?? ""),
  acceptRole: values.acceptRole ? 1 : 0,
  email: String(values.email ?? ""),
  dateOfBirth: values.dateOfBirth
    ? dayjs(values.dateOfBirth as dayjs.ConfigType).format("YYYY-MM-DD")
    : "",
  gender: Number(values.gender ?? 0),
});

export const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { setLoading } = useLoading();
  const [step, setStep] = useState<number>(0);

  const signUpMutation = useMutation({
    mutationFn: (payload: SignUpPayloadDto) => signUp(payload),
    onSuccess: (data) => {
      console.log(data);
      showNotification(SUCCESS_MESSAGE, NOTI_SUCCESS);
      localStorage.setItem('token', data.accessToken);
      navigate(ROUTER_PATH.FINISH);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
    onSettled: () => {
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const handleSubmit = async () => {
    if (step === 0) {
      await form.validateFields([...STEP1_FIELDS]);
      setStep(1);
      return;
    }

    if (step === 1) {
      await form.validateFields([...STEP2_FIELDS]);
      setStep(2);
      return;
    }

    signUpMutation.mutate(buildSignUpPayload(form.getFieldsValue()));
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
              title: "Xác Nhận",
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
            <div
              className={`signin-step-panel${step !== 0 ? " signin-step-panel--hidden" : ""}`}
            >
              <Step1 form={form} />
            </div>
            <div
              className={`signin-step-panel${step !== 1 ? " signin-step-panel--hidden" : ""}`}
            >
              <Step2 form={form} />
            </div>
            <div
              className={`signin-step-panel${step !== 2 ? " signin-step-panel--hidden" : ""}`}
            >
              <Step3 form={form} onEditStep={setStep} />
            </div>
          </Form>
        </div>
        <Button
          loading={signUpMutation.isPending}
          type="primary"
          className="signin-btn"
          onClick={handleSubmit}
        >
          {step < 2 ? "Tiếp tục" : "Tạo tài khoản"}
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
