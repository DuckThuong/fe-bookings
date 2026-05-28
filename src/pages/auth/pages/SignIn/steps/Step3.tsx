import { Button, Descriptions, Typography } from "antd";
import dayjs from "dayjs";
import "../style.scss";

const GENDER_LABEL: Record<string, string> = {
  "1": "Nam",
  "2": "Nữ",
  "3": "Khác",
};

interface Step3Props {
  values: {
    name?: string;
    phone?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  onEditStep: (step: number) => void;
}

export const Step3 = ({ values, onEditStep }: Step3Props) => {
  const { name, phone, email, dateOfBirth, gender } = values;

  const dobFormatted = dateOfBirth
    ? dayjs(dateOfBirth).format("YYYY-MM-DD")
    : "—";
  const genderLabel = GENDER_LABEL[String(gender)] ?? "—";

  return (
    <div className="signIn__step-3">
      <p className="signin-header__eyebrow">Bước 3 / 3 — Xác nhận thông tin</p>

      <Descriptions
        className="signin-confirm"
        title="Tài khoản"
        bordered
        column={1}
        size="middle"
        extra={
          <Button type="link" onClick={() => onEditStep(0)}>
            Sửa
          </Button>
        }
        items={[
          {
            label: "Họ và tên",
            children: name,
          },
          {
            label: "Số điện thoại",
            children: phone,
          },
        ]}
      />

      <Descriptions
        className="signin-confirm"
        title="Thông tin cá nhân"
        bordered
        column={1}
        size="middle"
        extra={
          <Button type="link" onClick={() => onEditStep(1)}>
            Sửa
          </Button>
        }
        items={[
          {
            label: "Email",
            children: email || "—",
          },
          {
            label: "Ngày sinh",
            children: dobFormatted,
          },
          {
            label: "Giới tính",
            children: genderLabel,
          },
        ]}
      />

      <Typography.Paragraph className="signin-confirm__note" type="secondary">
        Vui lòng kiểm tra lại thông tin trước khi tạo tài khoản.
      </Typography.Paragraph>
    </div>
  );
};
