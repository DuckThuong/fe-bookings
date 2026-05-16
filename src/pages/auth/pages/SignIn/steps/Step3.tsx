import { Form, type FormInstance } from "antd";
import "../style.scss";
import OTPInput from "@components/FormOtp/formOtp";
interface SignInProps {
  form: FormInstance;
}

export const Step3 = (props: SignInProps) => {
  return (
    <div className="signIn__step-3">
      <Form.Item
        label={<span>Nhập mã OTP</span>}
        name="otp"
        rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
      >
        <OTPInput length={6} />
      </Form.Item>
    </div>
  );
};
