import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Tag, Typography } from "antd";
import "./style.scss";

const { Title, Paragraph } = Typography;

const initialBookings = [
  {
    id: "BKG-001",
    route: "Hà Nội → TP. Hồ Chí Minh",
    date: "22/06/2026",
    time: "06:00",
    passengerName: "Nguyễn Văn An",
    seat: "12A",
    pickup: "Bến xe Mỹ Đình",
    dropoff: "Bến xe Miền Đông",
    paymentMethod: "Thẻ tín dụng",
    status: "Đã xác nhận",
    bookingCode: "AN1234",
    contactPhone: "0987654321",
    contactEmail: "an.nguyen@example.com",
    note: "Vui lòng ưu tiên ghế gần cửa sổ.",
  },
  {
    id: "BKG-002",
    route: "Hà Nội → Đà Nẵng",
    date: "28/06/2026",
    time: "08:30",
    passengerName: "Lê Thị Hoa",
    seat: "05B",
    pickup: "Bến xe Giáp Bát",
    dropoff: "Bến xe Trung tâm Đà Nẵng",
    paymentMethod: "Chuyển khoản",
    status: "Chờ khởi hành",
    bookingCode: "HOA237",
    contactPhone: "0912345678",
    contactEmail: "hoa.le@example.com",
    note: "Mang theo hành lý cỡ lớn.",
  },
  {
    id: "BKG-003",
    route: "Hà Nội → Nha Trang",
    date: "04/07/2026",
    time: "20:00",
    passengerName: "Phạm Minh Tuấn",
    seat: "03C",
    pickup: "Đón tận nơi",
    dropoff: "Giao tận nơi",
    paymentMethod: "Tiền mặt",
    status: "Chưa thanh toán",
    bookingCode: "TUN789",
    contactPhone: "0935123456",
    contactEmail: "tuan.pham@example.com",
    note: "Yêu cầu ghế riêng tư nếu có thể.",
  },
];

export const ProfileTicket = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [form] = Form.useForm();

  const activeBooking = selectedBookingId
    ? (bookings.find((item) => item.id === selectedBookingId) ?? null)
    : null;

  useEffect(() => {
    if (!activeBooking) {
      return;
    }

    form.setFieldsValue({
      passengerName: activeBooking.passengerName,
      contactPhone: activeBooking.contactPhone,
      contactEmail: activeBooking.contactEmail,
      pickup: activeBooking.pickup,
      dropoff: activeBooking.dropoff,
      note: activeBooking.note,
    });
  }, [activeBooking, form]);

  const handleSave = (values: any) => {
    if (!activeBooking) {
      return;
    }

    setBookings((prev) =>
      prev.map((item) =>
        item.id === activeBooking.id
          ? {
              ...item,
              passengerName: values.passengerName,
              contactPhone: values.contactPhone,
              contactEmail: values.contactEmail,
              pickup: values.pickup,
              dropoff: values.dropoff,
              note: values.note,
            }
          : item,
      ),
    );
  };

  return (
    <div className="profile-ticket">
      <div className="profile-ticket__header">
        <Title className="profile-ticket__title">Quản lý vé đã đặt</Title>
        <Paragraph className="profile-ticket__description">
          Xem danh sách vé bạn đã đặt, mở chi tiết và cập nhật thông tin phụ trợ
          cho mỗi vé.
        </Paragraph>
      </div>

      <div
        className={`profile-ticket__content ${!activeBooking ? "list-only" : ""}`}
      >
        {!activeBooking ? (
          <aside className="profile-ticket__list">
            <div className="profile-ticket__list-title">Vé đã đặt</div>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`profile-ticket__item ${booking.id === selectedBookingId ? "active" : ""}`}
                onClick={() => setSelectedBookingId(booking.id)}
              >
                <div className="profile-ticket__item-top">
                  <div>
                    <div className="profile-ticket__item-route">
                      {booking.route}
                    </div>
                    <div className="profile-ticket__item-meta">
                      {booking.date} · {booking.time}
                    </div>
                  </div>
                  <Tag
                    color={
                      booking.status === "Đã xác nhận"
                        ? "success"
                        : booking.status === "Chờ khởi hành"
                          ? "processing"
                          : "warning"
                    }
                  >
                    {booking.status}
                  </Tag>
                </div>
                <div className="profile-ticket__item-bottom">
                  <span>Mã: {booking.bookingCode}</span>
                  <span>Seat: {booking.seat}</span>
                </div>
              </div>
            ))}
          </aside>
        ) : (
          <main className="profile-ticket__detail">
            <div className="profile-ticket__detail-header">
              <Button type="link" onClick={() => setSelectedBookingId(null)}>
                ← Quay lại danh sách vé
              </Button>
            </div>

            <Card className="profile-ticket__detail-card" bordered={false}>
              <div className="profile-ticket__section-title">Chi tiết vé</div>
              <div className="profile-ticket__detail-grid">
                <div className="profile-ticket__detail-row">
                  <span>Hành trình</span>
                  <strong>{activeBooking.route}</strong>
                </div>
                <div className="profile-ticket__detail-row">
                  <span>Ngày - Giờ</span>
                  <strong>
                    {activeBooking.date} · {activeBooking.time}
                  </strong>
                </div>
                <div className="profile-ticket__detail-row">
                  <span>Hành khách</span>
                  <strong>{activeBooking.passengerName}</strong>
                </div>
                <div className="profile-ticket__detail-row">
                  <span>Ghế</span>
                  <strong>{activeBooking.seat}</strong>
                </div>
                <div className="profile-ticket__detail-row">
                  <span>Điểm lên xe</span>
                  <strong>{activeBooking.pickup}</strong>
                </div>
                <div className="profile-ticket__detail-row">
                  <span>Điểm xuống xe</span>
                  <strong>{activeBooking.dropoff}</strong>
                </div>
                <div className="profile-ticket__detail-row">
                  <span>Phương thức thanh toán</span>
                  <strong>{activeBooking.paymentMethod}</strong>
                </div>
              </div>
            </Card>

            <Card className="profile-ticket__form-card" bordered={false}>
              <div className="profile-ticket__section-title">
                Cập nhật thông tin vé
              </div>
              {activeBooking.status === "Đã xác nhận" ? (
                <Paragraph type="secondary">
                  Vé này đã được nhà xe xác nhận, bạn không thể sửa thông tin
                  thêm.
                </Paragraph>
              ) : (
                <Form form={form} layout="vertical" onFinish={handleSave}>
                  <Form.Item
                    label="Tên hành khách"
                    name="passengerName"
                    rules={[{ required: true, message: "Nhập tên hành khách" }]}
                  >
                    <Input placeholder="Nguyễn Văn An" />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại liên hệ"
                    name="contactPhone"
                    rules={[
                      { required: true, message: "Nhập số điện thoại liên hệ" },
                    ]}
                  >
                    <Input placeholder="0987654321" />
                  </Form.Item>

                  <Form.Item
                    label="Email liên hệ"
                    name="contactEmail"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Nhập email hợp lệ",
                      },
                    ]}
                  >
                    <Input placeholder="example@domain.com" />
                  </Form.Item>

                  <Form.Item
                    label="Điểm lên xe"
                    name="pickup"
                    rules={[{ required: true, message: "Nhập điểm lên xe" }]}
                  >
                    <Input placeholder="Bến xe Mỹ Đình" />
                  </Form.Item>

                  <Form.Item
                    label="Điểm xuống xe"
                    name="dropoff"
                    rules={[{ required: true, message: "Nhập điểm xuống xe" }]}
                  >
                    <Input placeholder="Bến xe Miền Đông" />
                  </Form.Item>

                  <Form.Item label="Ghi chú thêm" name="note">
                    <Input.TextArea
                      rows={4}
                      placeholder="Ví dụ: cần xe đưa đón, ưu tiên lối đi..."
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      Lưu cập nhật
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </main>
        )}
      </div>
    </div>
  );
};
