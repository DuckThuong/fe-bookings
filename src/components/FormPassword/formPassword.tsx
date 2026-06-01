import { Form, Input, type FormItemProps } from "antd";
import type { PasswordProps } from "antd/es/input";
import { Link } from "react-router-dom";
import "./formPassword.scss";

interface FormPasswordProps {
  label: string;
  name: string;
  placeholder?: string;
  formItemProps?: FormItemProps;
  passwordProps?: PasswordProps;
  size?: "small" | "middle" | "large";
  actionText?: string;
  actionTo?: string;
  onActionClick?: () => void;
  vertical?: boolean;
  disabled?: boolean;
  status?: "error" | "warning";
}

export const FormPassword = ({
  label,
  name,
  placeholder,
  formItemProps,
  passwordProps,
  size = "middle",
  actionText,
  actionTo,
  onActionClick,
  vertical = false,
  disabled = false,
  status,
}: FormPasswordProps) => {
  const hasRequiredRule = formItemProps?.rules?.some((rule) => {
    if (typeof rule !== "object" || !rule) {
      return false;
    }

    return "required" in rule && Boolean(rule.required);
  });

  const actionNode =
    actionText && actionTo ? (
      <Link to={actionTo} className="label__left">
        {actionText}
      </Link>
    ) : actionText && onActionClick ? (
      <button
        type="button"
        className="label__left label__left--button"
        onClick={onActionClick}
      >
        {actionText}
      </button>
    ) : null;

  return (
    <div className={`form-input ${vertical ? "form-input--vertical" : ""}`}>
      <div className="label">
        <span
          className={`label__right ${hasRequiredRule ? "label__right--required" : ""}`}
        >
          {label}
        </span>
        {actionNode}
      </div>
      <Form.Item
        name={name}
        {...formItemProps}
        label={undefined}
        labelCol={vertical ? { span: 24 } : undefined}
      >
        <Input.Password
          className="form-input__password"
          placeholder={placeholder}
          size={size}
          disabled={disabled}
          status={status}
          visibilityToggle
          {...passwordProps}
        />
      </Form.Item>
    </div>
  );
};
