import {
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import { STATUS_CONFIG } from "../../../../../common/constants/profile.constant";
import { TicketStatusTracker } from "../TicketStatusTracker";
import { DetailRow } from "./DetailRow";
import "./BookingDetail.scss";
import type { ProfileBooking } from "@/pages/profile/utils/mapProfileBooking";

interface BookingDetailProps {
  booking: ProfileBooking;
  saving: boolean;
  onSave: (values: Partial<ProfileBooking>) => void;
  onContactOperator: (operatorCode: string, operatorName: string, operatorUserId?: number) => void;
  onRequestRefund?: (bookingId: string) => void;
  refundLoading?: boolean;
}

export const BookingDetail = ({
  booking,
  saving,
  onSave,
  onContactOperator,
  onRequestRefund,
  refundLoading,
}: BookingDetailProps) => {
  const [form] = Form.useForm();
  const cfg = STATUS_CONFIG[booking.status];
  const locked = !booking.canEdit;

  useEffect(() => {
    form.setFieldsValue({
      passengerName: booking.passengerName,
      contactPhone: booking.contactPhone,
      contactEmail: booking.contactEmail,
      pickupValue: booking.pickupValue,
      dropoffValue: booking.dropoffValue,
      note: booking.note,
    });
  }, [booking, form]);

  const handleFinish = (values: {
    passengerName: string;
    contactPhone: string;
    contactEmail?: string;
    pickupValue: string;
    dropoffValue: string;
    note?: string;
  }) => {
    onSave({
      passengerName: values.passengerName,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail ?? booking.contactEmail,
      pickupValue: values.pickupValue,
      dropoffValue: values.dropoffValue,
      note: values.note ?? "",
    });
  };

  return (
    <div className="pt-detail">
      <div className="pt-ticket-hero">
        <div className="pt-ticket-hero__left">
          <p className="pt-ticket-hero__code">#{booking.bookingCode}</p>
          <h3 className="pt-ticket-hero__route">{booking.route}</h3>
          <div className="pt-ticket-hero__time">
            <ClockCircleOutlined /> {booking.date} · {booking.time}
          </div>
        </div>

        <span
          className="pt-ticket-hero__status"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          <span className="pt-list-item__dot" style={{ background: cfg.dot }} />
          {booking.status}
        </span>
      </div>

      <div className="pt-info-card">
        <p className="pt-card-title">
          <FileTextOutlined /> Chi tiết chuyến
        </p>
        <div className="pt-info-grid">
          <DetailRow label="Hành khách" value={booking.passengerName} />
          <DetailRow label="Số ghế" value={booking.seat} />
          <DetailRow label="Điểm lên xe" value={booking.pickup} />
          <DetailRow label="Điểm xuống xe" value={booking.dropoff} />
          <DetailRow label="Phương thức TT" value={booking.paymentMethod} />
          <DetailRow label="Liên hệ" value={booking.contactPhone} />
        </div>

        {booking.note && (
          <div className="pt-info-note">
            <span className="pt-info-note__icon">📝</span>
            <span>{booking.note}</span>
          </div>
        )}
      </div>

      <TicketStatusTracker
        booking={booking}
        onContactOperator={onContactOperator}
        onRequestRefund={onRequestRefund}
        refundLoading={refundLoading}
      />

      <div className="pt-form-card">
        <p className="pt-card-title">
          <FileTextOutlined /> Cập nhật thông tin
        </p>

        {locked ? (
          booking.status === "Đã xác nhận" || booking.status === "Chờ khởi hành" ? null : (
            <div className="pt-locked-notice">
              <span>
                {booking.status === "Chờ xác nhận"
                  ? "Đơn đang chờ nhà xe xác nhận — không thể chỉnh sửa."
                  : booking.status === "Đã hủy"
                    ? "Đơn đặt vé đã bị hủy — không thể chỉnh sửa."
                    : "Chỉ có thể chỉnh sửa khi đơn đang giữ chỗ và chưa hết hạn."}
              </span>
            </div>
          )
        ) : (
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <div className="pt-form-grid">
              <Form.Item
                label="Tên hành khách"
                name="passengerName"
                rules={[{ required: true, message: "Nhập tên hành khách" }]}
              >
                <Input placeholder="Nguyễn Văn An" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="contactPhone"
                rules={[
                  { required: true, message: "Nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại phải gồm 10 chữ số",
                  },
                ]}
              >
                <Input placeholder="0987654321" />
              </Form.Item>

              <Form.Item
                label="Email liên hệ"
                name="contactEmail"
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="example@domain.com" />
              </Form.Item>

              <Form.Item
                label="Điểm lên xe"
                name="pickupValue"
                rules={[{ required: true, message: "Nhập điểm lên xe" }]}
              >
                <Input placeholder="Nhập điểm lên xe" />
              </Form.Item>
            </div>

            <Form.Item
              label="Điểm xuống xe"
              name="dropoffValue"
              rules={[{ required: true, message: "Nhập điểm xuống xe" }]}
            >
              <Input placeholder="Nhập điểm xuống xe" />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea
                rows={3}
                placeholder="Ưu tiên ghế cửa sổ, cần hỗ trợ hành lý..."
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="pt-save-btn"
                loading={saving}
              >
                Lưu cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};
