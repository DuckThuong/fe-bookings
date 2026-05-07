import { Input, type InputRef } from "antd";
import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import "./formOtp.scss";

interface OTPInputProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  numericOnly?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  gap?: number | string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value = "",
  onChange,
  length = 4,
  numericOnly = true,
  autoFocus = false,
  disabled = false,
  containerStyle,
  inputStyle,
  gap = "12px",
}) => {
  const inputRefs = useRef<(InputRef | null)[]>([]);

  const otp = value
    ? value.split("").concat(Array(length).fill("")).slice(0, length)
    : Array(length).fill("");

  const triggerChange = (newOtp: string[]) => {
    onChange?.(newOtp.join(""));
  };

  const handleChange = (index: number, inputValue: string) => {
    if (numericOnly && inputValue && !/^\d+$/.test(inputValue)) return;

    const newOtp = [...otp];
    newOtp[index] = inputValue.slice(-1);
    triggerChange(newOtp);

    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);

    if (numericOnly && !/^\d+$/.test(pastedData)) return;

    const newOtp = Array(length).fill("");
    pastedData.split("").forEach((char, index) => {
      if (index < length) {
        newOtp[index] = char;
      }
    });

    triggerChange(newOtp);

    const lastFilledIndex = Math.min(pastedData.length, length) - 1;
    inputRefs.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="form_otp">
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className="form_otp-item"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          style={{
            width: "50px",
            height: "50px",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            ...inputStyle,
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
