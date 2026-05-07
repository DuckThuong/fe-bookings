import { formatPhone } from "@/common/contexts/format";
import { Form, Input, Select } from "antd";

interface InputPhoneNumberProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
}

export const InputPhoneNumber: React.FC<InputPhoneNumberProps> = (
  props: InputPhoneNumberProps,
) => {
  const { value, onChange, onBlur } = props;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatPhone(e.target.value));
  };
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(formatPhone(e.target.value));
  };

  const regions = [
    {
      key: 1,
      value: "VN",
      label: "+84",
    },
    {
      key: 2,
      value: "US",
      label: "+80",
    },
  ];
  return (
    <Form.Item
      label="Số điện thoại"
      name="phone"
      rules={[
        { required: true, message: "Vui lòng nhập số điện thoại của bạn" },
      ]}
    >
      <Input
        type="tel"
        placeholder="Nhập số điện thoại của bạn"
        autoComplete="tel"
        size="large"
        value={value}
        maxLength={13}
        onChange={onInputChange}
        onBlur={onInputBlur}
        addonBefore={
          <Select defaultValue="VN" options={regions} style={{ width: 110 }} />
        }
      />
    </Form.Item>
  );
};
