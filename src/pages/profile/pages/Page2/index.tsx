import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Upload, Typography } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUser } from "@/common/contexts/UserContext";
import "./style.scss";

const { Title, Paragraph } = Typography;

const getBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const ProfileInformation = ({
  onOpenPayment,
}: {
  onOpenPayment?: () => void;
}) => {
  const { user, setUser } = useUser();
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || "");

  useEffect(() => {
    form.setFieldsValue({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      birthday: user.birthday ? dayjs(user.birthday, "DD/MM/YYYY") : undefined,
    });
    setAvatarUrl(user.avatarUrl || "");
  }, [form, user]);

  const handleFinish = (values: {
    userName: string;
    email?: string;
    phone?: string;
    address?: string;
    birthday?: any;
  }) => {
    setUser({
      ...user,
      userName: values.userName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      birthday: values.birthday ? values.birthday.format("DD/MM/YYYY") : "",
      avatarUrl,
    });
  };

  const handleAvatarUpload = async (file: any) => {
    const imageUrl = await getBase64(file);
    setAvatarUrl(imageUrl);
    return false;
  };

  return (
    <div className="profile-information">
      <div className="profile-information__header">
        <Title className="profile-information__title">Thông tin cá nhân</Title>
        <Paragraph className="profile-information__description">
          Cập nhật avatar và thông tin cơ bản để hồ sơ của bạn luôn chính xác.
        </Paragraph>
      </div>

      <div className="profile-information__grid">
        <section className="profile-information__form-section">
          <div className="profile-information__avatar-panel">
            <div className="profile-information__avatar-preview">
              <div className="profile-information__avatar-circle">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" />
                ) : (
                  <UserOutlined />
                )}
              </div>
            </div>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
            >
              <Button icon={<UploadOutlined />}>Thay avatar</Button>
            </Upload>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="profile-information__form"
            onFinish={handleFinish}
          >
            <Form.Item
              label="Họ và tên"
              name="userName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không đúng định dạng" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^\d{9,12}$/,
                  message: "Số điện thoại phải gồm 9-12 chữ số",
                },
              ]}
            >
              <Input placeholder="0987654321" />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Nhập địa chỉ liên hệ" />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="birthday">
              <DatePicker
                className="profile-information__date-picker"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </section>

        <aside className="profile-information__payment-section">
          <div className="profile-information__payment-card">
            <div className="profile-information__payment-title">
              Thông tin thanh toán
            </div>
            <div className="profile-information__payment-subtitle">
              Quản lý phương thức thanh toán của bạn để đặt vé nhanh và an toàn.
            </div>
            <div className="profile-information__payment-detail">
              <div className="profile-information__payment-row">
                <span>Phương thức hiện tại</span>
                <strong>Thẻ tín dụng</strong>
              </div>
              <div className="profile-information__payment-row">
                <span>Nhà phát hành</span>
                <strong>Visa</strong>
              </div>
              <div className="profile-information__payment-row">
                <span>Số thẻ</span>
                <strong>**** 1234</strong>
              </div>
            </div>
            <Button type="default" block onClick={onOpenPayment}>
              Cập nhật phương thức thanh toán
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};
