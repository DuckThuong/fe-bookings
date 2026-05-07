import { useState } from "react";
import "../style.scss";
import type { FormInstance } from "antd";

interface SignInProps {
  form: FormInstance;
}

export const Step2 = (props: SignInProps) => {
  const [gender, setGender] = useState<string>("");
  return (
    <div className="signIn__step-2">
      <div className="signin-header">
        <p className="signin-header__eyebrow">Bước 2 / 3 — Thông tin cá nhân</p>
      </div>

      {/* Giới tính */}
      <div className="signin-field">
        <label className="signin-field__label">Giới tính</label>
        <div className="signin-gender">
          {(
            [
              { value: "male", emoji: "👨", label: "Nam" },
              { value: "female", emoji: "👩", label: "Nữ" },
              { value: "other", emoji: "🧑", label: "Khác" },
            ] as const
          ).map((opt) => (
            <div
              key={opt.value}
              className={`signin-gender__opt ${
                gender === opt.value ? "signin-gender__opt--selected" : ""
              }`}
              onClick={() => setGender(opt.value)}
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
    </div>
  );
};
