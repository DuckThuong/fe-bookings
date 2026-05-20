import { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Form, Input, Upload, Tag } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CameraOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useUser } from "@/common/contexts/UserContext";
import "./style.scss";
import { useMutation } from "@tanstack/react-query";
import type { UpdateUserProfilePayloadDto } from "@/api/dtos/user.payload";
import { updateProfile } from "@/api/configs/user.config";
import { useNotification } from "@/providers/notificationProvider";
import { NOTI_SUCCESS } from "@/common/constants/constants";

// ─── Helpers ──────────────────────────────────────────────
const getBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

// ─── Sub: Avatar uploader ─────────────────────────────────
const AvatarUploader = ({
  avatarUrl,
  initials,
  onUpload,
}: {
  avatarUrl: string;
  initials: string;
  onUpload: (url: string) => void;
}) => {
  const handleBeforeUpload = async (file: File) => {
    const url = await getBase64(file);
    onUpload(url);
    return false; // prevent default upload
  };

  return (
    <div className="pi-avatar-wrap">
      <div className="pi-avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="pi-avatar__img" />
        ) : (
          <span className="pi-avatar__initials">{initials}</span>
        )}

        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
        >
          <button
            className="pi-avatar__upload-btn"
            aria-label="Thay ảnh đại diện"
          >
            <CameraOutlined />
          </button>
        </Upload>
      </div>

      <div className="pi-avatar__meta">
        <p className="pi-avatar__hint">JPG, PNG — tối đa 5MB</p>
      </div>
    </div>
  );
};

// ─── Sub: Payment card ────────────────────────────────────
const PaymentCard = ({ onOpenPayment }: { onOpenPayment?: () => void }) => (
  <div className="pi-payment-card">
    {/* Card visual */}
    <div className="pi-bank-card">
      <div className="pi-bank-card__top">
        <span className="pi-bank-card__chip" aria-hidden="true" />
        <span className="pi-bank-card__network">VISA</span>
      </div>
      <div className="pi-bank-card__number">•••• •••• •••• 1234</div>
      <div className="pi-bank-card__bottom">
        <div>
          <p className="pi-bank-card__label">Chủ thẻ</p>
          <p className="pi-bank-card__value">NGUYEN VAN A</p>
        </div>
        <div>
          <p className="pi-bank-card__label">Hết hạn</p>
          <p className="pi-bank-card__value">08 / 27</p>
        </div>
      </div>
    </div>

    {/* Details */}
    <div className="pi-payment-detail">
      <h4 className="pi-payment-detail__title">Phương thức thanh toán</h4>
      <p className="pi-payment-detail__sub">
        Quản lý thẻ để đặt vé nhanh và an toàn hơn.
      </p>

      {[
        { label: "Loại thẻ", value: "Thẻ tín dụng" },
        { label: "Nhà phát hành", value: "Visa" },
        { label: "Số thẻ", value: "**** 1234" },
      ].map((row) => (
        <div key={row.label} className="pi-payment-row">
          <span className="pi-payment-row__label">{row.label}</span>
          <span className="pi-payment-row__value">{row.value}</span>
        </div>
      ))}
    </div>

    {/* Security note */}
    <div className="pi-payment-secure">
      <SafetyOutlined className="pi-payment-secure__icon" />
      <span>Thông tin thẻ được mã hoá SSL 256-bit</span>
    </div>

    <Button
      block
      icon={<EditOutlined />}
      className="pi-payment-update-btn"
      onClick={onOpenPayment}
    >
      Cập nhật phương thức
    </Button>
  </div>
);

// ─── Main component ───────────────────────────────────────
export const ProfileInformation = ({
  onOpenPayment,
}: {
  onOpenPayment?: () => void;
}) => {
  const { user, setUser } = useUser();
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(user.userAvatar || "");
  const { showNotification } = useNotification();

  const initials = user.userName
    ? user.userName.trim().charAt(0).toUpperCase()
    : "K";

  useEffect(() => {
    form.setFieldsValue({
      userName: user.userName,
      email: user.userEmail,
      phone: user.userPhone,
      birthday: user.userDob ? dayjs(user.userDob, "YYYY-MM-DD") : undefined,
    });
    setAvatarUrl(user.userAvatar || "");
  }, [form, user]);

  const handleFinishMutation = useMutation({
    mutationFn: (payload: UpdateUserProfilePayloadDto) =>
      updateProfile(payload),
    onSuccess: (data) => {
      showNotification("Cập nhật thông tin thành công", NOTI_SUCCESS);
      setUser(data);
    },
  });

  const handleFinish = () => {
    const payload: UpdateUserProfilePayloadDto = {
      userName: form.getFieldValue("userName"),
      userEmail: form.getFieldValue("email"),
      userPhone: form.getFieldValue("phone"),
      userDob: form.getFieldValue("birthday")
        ? form.getFieldValue("birthday").format("YYYY-MM-DD")
        : undefined,
    };
    handleFinishMutation.mutate(payload);
  };
  // Call API to update profile

  return (
    <div className="profile-information">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="profile-information__header">
        <div className="pi-header__text">
          <h2 className="pi-header__title">Thông tin cá nhân</h2>
          <p className="pi-header__desc">
            Cập nhật thông tin để hồ sơ của bạn luôn chính xác.
          </p>
        </div>
        <Tag className="pi-header__tag" icon={<SafetyOutlined />}>
          Đã xác minh
        </Tag>
      </div>

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="profile-information__grid">
        {/* Left: avatar + form */}
        <section className="profile-information__form-section">
          <div className="profile-information__form-card">
            <AvatarUploader
              avatarUrl={avatarUrl}
              initials={initials}
              onUpload={setAvatarUrl}
            />

            <Form
              form={form}
              layout="vertical"
              className="profile-information__form"
              onFinish={handleFinish}
            >
              <div className="pi-form-grid">
                <Form.Item
                  label="Họ và tên"
                  name="userName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^\d{9,12}$/,
                      message: "Số điện thoại phải gồm 9–12 chữ số",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="0987 654 321"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không đúng định dạng" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="example@email.com"
                  />
                </Form.Item>

                <Form.Item label="Ngày sinh" name="birthday">
                  <DatePicker
                    prefix={<CalendarOutlined />}
                    format="YYYY-MM-DD"
                    placeholder="YYYY-MM-DD"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="pi-save-btn"
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>

        {/* Right: payment card */}
        <aside className="profile-information__payment-section">
          <PaymentCard onOpenPayment={onOpenPayment} />
        </aside>
      </div>
    </div>
  );
};
