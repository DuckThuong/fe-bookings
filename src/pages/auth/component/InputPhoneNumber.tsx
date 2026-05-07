interface InputPhoneNumberProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputState: string;
}

export const InputPhoneNumber: React.FC<InputPhoneNumberProps> = (
  props: InputPhoneNumberProps,
) => {
  const { value, onChange, onBlur, inputState } = props;

  return (
    <div className="login-field">
      <label className="login-field__label" htmlFor="phone">
        Số điện thoại <span className="login-field__required">*</span>
      </label>

      <div
        className={`login-field__wrapper login-field__wrapper--${inputState}`}
      >
        <div className="login-field__prefix">
          <span className="login-field__flag">🇻🇳</span>
          <span className="login-field__code">+84</span>
          <span className="login-field__chevron">▾</span>
        </div>
        <input
          id="phone"
          className="login-field__input"
          type="tel"
          inputMode="numeric"
          placeholder="098 765 4321"
          value={value}
          maxLength={13}
          autoComplete="tel"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
        {inputState === "valid" && (
          <span className="login-field__check">✓</span>
        )}
      </div>

      {inputState === "error" ? (
        <p className="login-field__helper login-field__helper--error">
          Vui lòng nhập đủ 10 chữ số điện thoại
        </p>
      ) : (
        <p className="login-field__helper">
          <svg
            viewBox="0 0 14 14"
            fill="none"
            className="login-field__helper-icon"
          >
            <circle cx="7" cy="7" r="6" stroke="#9ca3af" strokeWidth="1.2" />
            <path
              d="M7 6v4M7 4.5v.5"
              stroke="#9ca3af"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          Nhập số thuê bao Việt Nam (10 chữ số)
        </p>
      )}
    </div>
  );
};
