import { useState } from "react";
import { Button, Card, Divider, Form, Select, Switch, Typography } from "antd";
import "./style.scss";

const { Title, Paragraph, Text } = Typography;

export const ProfileSettings = () => {
  const [form] = Form.useForm();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    promotions: false,
    bookingUpdates: true,
    paymentReminders: true,
    travelAlerts: false,
  });

  const handleSave = (values: any) => {
    console.log("Saved settings", values);
  };

  return (
    <div className="profile-settings">
      <div className="profile-settings__header">
        <Title className="profile-settings__title">Cài đặt thông báo</Title>
        <Paragraph className="profile-settings__description">
          Quản lý cách bạn nhận thông báo từ hệ thống: email, SMS, thông báo đẩy
          và các cập nhật liên quan đến hành trình.
        </Paragraph>
      </div>

      <Card className="profile-settings__card" bordered={false}>
        <div className="profile-settings__card-title">
          Tùy chọn thông báo chung
        </div>
        <Form
          form={form}
          layout="vertical"
          initialValues={notifications}
          onFinish={handleSave}
        >
          <Form.Item
            label="Nhận email thông báo"
            name="email"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item label="Nhận SMS" name="sms" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item
            label="Thông báo đẩy trên ứng dụng"
            name="push"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item
            label="Nhận tin khuyến mãi"
            name="promotions"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Divider />

          <div className="profile-settings__section-title">
            Cài đặt cảnh báo vé
          </div>

          <Form.Item
            label="Cập nhật đặt vé"
            name="bookingUpdates"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item
            label="Nhắc thanh toán"
            name="paymentReminders"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item
            label="Cảnh báo chuyến đi"
            name="travelAlerts"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Divider />

          <div className="profile-settings__section-title">Tùy chọn thêm</div>

          <Form.Item
            label="Phương thức liên hệ ưu tiên"
            name="preferredContact"
            initialValue="email"
          >
            <Select>
              <Select.Option value="email">Email</Select.Option>
              <Select.Option value="sms">SMS</Select.Option>
              <Select.Option value="phone">Cuộc gọi</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="profile-settings__actions">
            <Button type="primary" htmlType="submit">
              Lưu cài đặt
            </Button>
            <Button type="default" onClick={() => form.resetFields()}>
              Đặt lại
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card className="profile-settings__info" bordered={false}>
        <Text strong>Chú ý:</Text>
        <Paragraph>
          Bạn có thể bật hoặc tắt từng loại thông báo tùy theo nhu cầu. Nhắc
          thanh toán và cảnh báo chuyến đi sẽ giúp bạn không bỏ lỡ lịch trình và
          trạng thái vé.
        </Paragraph>
      </Card>
    </div>
  );
};
