import { useState } from "react";
import { Button, Form, Select, Switch } from "antd";
import {
  MailOutlined,
  MessageOutlined,
  BellOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  WarningOutlined,
  PhoneOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "./style.scss";

// ─── Types ────────────────────────────────────────────────
interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  promotions: boolean;
  bookingUpdates: boolean;
  paymentReminders: boolean;
  travelAlerts: boolean;
  preferredContact: "email" | "sms" | "phone";
}

// ─── Constants ────────────────────────────────────────────
const INITIAL_SETTINGS: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  promotions: false,
  bookingUpdates: true,
  paymentReminders: true,
  travelAlerts: false,
  preferredContact: "email",
};

interface SwitchItem {
  key: keyof Omit<NotificationSettings, "preferredContact">;
  icon: React.ReactNode;
  label: string;
  desc: string;
}

const CHANNEL_ITEMS: SwitchItem[] = [
  {
    key: "email",
    icon: <MailOutlined />,
    label: "Email",
    desc: "Thông báo gửi đến hộp thư của bạn",
  },
  {
    key: "sms",
    icon: <MessageOutlined />,
    label: "SMS",
    desc: "Tin nhắn thông báo đến số điện thoại",
  },
  {
    key: "push",
    icon: <BellOutlined />,
    label: "Thông báo đẩy",
    desc: "Thông báo trong ứng dụng GoRide",
  },
  {
    key: "promotions",
    icon: <TagsOutlined />,
    label: "Khuyến mãi",
    desc: "Ưu đãi, voucher và tin tức mới nhất",
  },
];

const ALERT_ITEMS: SwitchItem[] = [
  {
    key: "bookingUpdates",
    icon: <CheckCircleOutlined />,
    label: "Cập nhật đặt vé",
    desc: "Xác nhận, huỷ hoặc thay đổi chuyến",
  },
  {
    key: "paymentReminders",
    icon: <CreditCardOutlined />,
    label: "Nhắc thanh toán",
    desc: "Nhắc trước khi hết hạn giữ chỗ",
  },
  {
    key: "travelAlerts",
    icon: <WarningOutlined />,
    label: "Cảnh báo chuyến đi",
    desc: "Trễ xe, thay đổi lịch trình",
  },
];

const CONTACT_OPTIONS = [
  { value: "email", label: "Email", icon: <MailOutlined /> },
  { value: "sms", label: "SMS", icon: <MessageOutlined /> },
  { value: "phone", label: "Cuộc gọi", icon: <PhoneOutlined /> },
];

// ─── Sub: SwitchRow ───────────────────────────────────────
const SwitchRow = ({
  item,
  checked,
  onChange,
}: {
  item: SwitchItem;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className={`ps-switch-row${checked ? " ps-switch-row--on" : ""}`}>
    <div className="ps-switch-row__icon">{item.icon}</div>
    <div className="ps-switch-row__text">
      <span className="ps-switch-row__label">{item.label}</span>
      <span className="ps-switch-row__desc">{item.desc}</span>
    </div>
    <Switch checked={checked} onChange={onChange} className="ps-switch" />
  </div>
);

// ─── Sub: SettingsGroup ───────────────────────────────────
const SettingsGroup = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="ps-group">
    <p className="ps-group__title">
      <span className="ps-group__icon">{icon}</span>
      {title}
    </p>
    <div className="ps-group__body">{children}</div>
  </div>
);

// ─── Main component ───────────────────────────────────────
export const ProfileSettings = () => {
  const [form] = Form.useForm();
  const [values, setValues] = useState<NotificationSettings>(INITIAL_SETTINGS);

  const toggle = (key: keyof Omit<NotificationSettings, "preferredContact">) =>
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    // TODO: call API to persist settings
    console.log("Saved settings:", values);
  };

  const handleReset = () => {
    setValues(INITIAL_SETTINGS);
    form.resetFields();
  };

  return (
    <div className="profile-settings">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="profile-settings__header">
        <div className="ps-header__text">
          <h2 className="ps-header__title">Cài đặt thông báo</h2>
          <p className="ps-header__desc">
            Chọn kênh và loại thông báo bạn muốn nhận từ GoRide.
          </p>
        </div>
      </div>

      {/* ── Settings card ───────────────────────────────── */}
      <div className="profile-settings__card">
        {/* Channel group */}
        <SettingsGroup title="Kênh nhận thông báo" icon={<BellOutlined />}>
          {CHANNEL_ITEMS.map((item) => (
            <SwitchRow
              key={item.key}
              item={item}
              checked={values[item.key]}
              onChange={() => toggle(item.key)}
            />
          ))}
        </SettingsGroup>

        <div className="ps-divider" />

        {/* Alert group */}
        <SettingsGroup title="Cảnh báo & nhắc nhở" icon={<WarningOutlined />}>
          {ALERT_ITEMS.map((item) => (
            <SwitchRow
              key={item.key}
              item={item}
              checked={values[item.key]}
              onChange={() => toggle(item.key)}
            />
          ))}
        </SettingsGroup>

        <div className="ps-divider" />

        {/* Preferred contact */}
        <SettingsGroup title="Liên hệ ưu tiên" icon={<PhoneOutlined />}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="preferredContact"
              initialValue={values.preferredContact}
              style={{ marginBottom: 0 }}
            >
              <div className="ps-contact-row">
                {CONTACT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`ps-contact-btn${values.preferredContact === opt.value ? " ps-contact-btn--active" : ""}`}
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        preferredContact:
                          opt.value as NotificationSettings["preferredContact"],
                      }))
                    }
                  >
                    <span className="ps-contact-btn__icon">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </Form.Item>
          </Form>
        </SettingsGroup>

        {/* Actions */}
        <div className="ps-actions">
          <Button
            className="ps-actions__reset"
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            Đặt lại
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            className="ps-actions__save"
            onClick={handleSave}
          >
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
};
