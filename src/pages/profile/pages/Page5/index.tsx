import { useState } from "react";
import { Button, Form, Select, Switch, Tag } from "antd";
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
  CheckOutlined,
  CloseOutlined,
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
    <Switch
      checked={checked}
      onChange={onChange}
      className="ps-switch"
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
    />
  </div>
);

// ─── Sub: StatsCard ───────────────────────────────────────
const StatsCard = ({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) => (
  <div className="ps-stat">
    <div className="ps-stat__icon" style={{ background: `${color}15` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="ps-stat__label">{label}</div>
    <div className="ps-stat__value">{value}</div>
    <div className="ps-stat__sub">{sub}</div>
  </div>
);

// ─── Main component ───────────────────────────────────────
export const ProfileSettings = () => {
  const [form] = Form.useForm();
  const [values, setValues] = useState<NotificationSettings>(INITIAL_SETTINGS);

  const toggle = (key: keyof Omit<NotificationSettings, "preferredContact">) =>
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    console.log("Saved settings:", values);
  };

  const handleReset = () => {
    setValues(INITIAL_SETTINGS);
    form.resetFields();
  };

  const activeCount = Object.entries(values).filter(([k, v]) => {
    if (k === "preferredContact") return false;
    return v === true;
  }).length;

  const totalCount = Object.keys(values).filter(k => k !== "preferredContact").length;

  return (
    <div className="profile-settings">
      {/* ── Hero banner ──────────────────────────────────── */}
      <div className="ps-hero">
        <div className="ps-hero__icon">
          <BellOutlined />
        </div>
        <div className="ps-hero__info">
          <div className="ps-hero__greeting">Cài đặt</div>
          <div className="ps-hero__title">Thông báo</div>
          <div className="ps-hero__desc">
            Quản lý kênh và loại thông báo bạn muốn nhận từ GoRide
          </div>
        </div>
        <Tag className="ps-hero__badge" bordered={false} icon={<CheckOutlined />}>
          {activeCount}/{totalCount} đang bật
        </Tag>
      </div>

      {/* ── Stats summary ───────────────────────────────── */}
      <div className="ps-stats">
        <StatsCard
          icon={<MailOutlined />}
          label="Kênh đã bật"
          value={`${activeCount}`}
          sub={`trong tổng ${totalCount} kênh`}
          color="#f5a623"
        />
        <StatsCard
          icon={<BellOutlined />}
          label="Trạng thái"
          value={activeCount > 0 ? "Hoạt động" : "Tắt"}
          sub={activeCount > 0 ? "Đang nhận thông báo" : "Không nhận thông báo"}
          color={activeCount > 0 ? "#16a34a" : "#6b7280"}
        />
        <StatsCard
          icon={<PhoneOutlined />}
          label="Liên hệ ưu tiên"
          value={values.preferredContact === "email" ? "Email" : values.preferredContact === "sms" ? "SMS" : "Cuộc gọi"}
          sub="Phương thức ưu tiên"
          color="#3b82f6"
        />
      </div>

      {/* ── Channel section ─────────────────────────────── */}
      <div className="ps-section">
        <p className="ps-section__title">
          <i className="ti ti-bell" />
          Kênh nhận thông báo
        </p>
        {CHANNEL_ITEMS.map((item) => (
          <SwitchRow
            key={item.key}
            item={item}
            checked={values[item.key]}
            onChange={() => toggle(item.key)}
          />
        ))}
      </div>

      {/* ── Alert section ───────────────────────────────── */}
      <div className="ps-section">
        <p className="ps-section__title">
          <i className="ti ti-alarm" />
          Cảnh báo & nhắc nhở
        </p>
        {ALERT_ITEMS.map((item) => (
          <SwitchRow
            key={item.key}
            item={item}
            checked={values[item.key]}
            onChange={() => toggle(item.key)}
          />
        ))}
      </div>

      {/* ── Preferred contact section ───────────────────── */}
      <div className="ps-section">
        <p className="ps-section__title">
          <i className="ti ti-phone" />
          Liên hệ ưu tiên
        </p>
        <Form form={form} layout="vertical" className="ps-form">
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
      </div>

      {/* ── Actions ─────────────────────────────────────── */}
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
  );
};
