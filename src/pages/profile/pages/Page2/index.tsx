import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Tag } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useUser } from "@/common/contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import type { UpdateUserProfilePayloadDto } from "@/api/dtos/user.payload";
import { updateProfile } from "@/api/configs/user.config";
import { useNotification } from "@/providers/notificationProvider";
import { NOTI_SUCCESS } from "@/common/constants/constants";
import { AvatarUploader, PaymentCard } from "./components";
import "./style.scss";

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
