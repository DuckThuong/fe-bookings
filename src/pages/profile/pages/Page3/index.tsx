import { useEffect, useState } from "react";
import { Button, Empty, Form, Input, Tag } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import "./style.scss";

// ─── Types ────────────────────────────────────────────────
interface Booking {
  id: string;
  route: string;
  date: string;
  time: string;
  passengerName: string;
  seat: string;
  pickup: string;
  dropoff: string;
  paymentMethod: string;
  status: "Đã xác nhận" | "Chờ khởi hành" | "Chưa thanh toán";
  bookingCode: string;
  contactPhone: string;
  contactEmail: string;
  note: string;
}

// ─── Fake data ────────────────────────────────────────────
const INITIAL_BOOKINGS: Booking[] = [
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

// ─── Status config ────────────────────────────────────────
const STATUS_CONFIG: Record<
  Booking["status"],
  { color: string; bg: string; dot: string }
> = {
  "Đã xác nhận": { color: "#15803d", bg: "#dcfce7", dot: "#22c55e" },
  "Chờ khởi hành": { color: "#854d0e", bg: "#fef9c3", dot: "#eab308" },
  "Chưa thanh toán": { color: "#9a3412", bg: "#ffedd5", dot: "#f97316" },
};

// ─── Sub: BookingListItem ─────────────────────────────────
const BookingListItem = ({
  booking,
  isActive,
  onClick,
}: {
  booking: Booking;
  isActive: boolean;
  onClick: () => void;
}) => {
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <button
      className={`pt-list-item${isActive ? " pt-list-item--active" : ""}`}
      onClick={onClick}
    >
      {/* Route + status */}
      <div className="pt-list-item__top">
        <span className="pt-list-item__route">{booking.route}</span>
        <span
          className="pt-list-item__status"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          <span className="pt-list-item__dot" style={{ background: cfg.dot }} />
          {booking.status}
        </span>
      </div>

      {/* Meta row */}
      <div className="pt-list-item__meta">
        <span>
          <CalendarOutlined /> {booking.date} · {booking.time}
        </span>
        <span className="pt-list-item__sep" />
        <span>Ghế {booking.seat}</span>
      </div>

      {/* Code */}
      <div className="pt-list-item__code">
        <span>#{booking.bookingCode}</span>
        <span className="pt-list-item__arrow">›</span>
      </div>
    </button>
  );
};

// ─── Sub: DetailRow ───────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="pt-detail-row">
    <span className="pt-detail-row__label">{label}</span>
    <span className="pt-detail-row__value">{value}</span>
  </div>
);

// ─── Sub: BookingDetail ───────────────────────────────────
const BookingDetail = ({
  booking,
  onSave,
}: {
  booking: Booking;
  onSave: (id: string, values: Partial<Booking>) => void;
}) => {
  const [form] = Form.useForm();
  const cfg = STATUS_CONFIG[booking.status];
  const locked = booking.status === "Đã xác nhận";

  useEffect(() => {
    form.setFieldsValue({
      passengerName: booking.passengerName,
      contactPhone: booking.contactPhone,
      contactEmail: booking.contactEmail,
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      note: booking.note,
    });
  }, [booking, form]);

  const handleFinish = (values: Partial<Booking>) => onSave(booking.id, values);

  return (
    <div className="pt-detail">
      {/* ── Ticket hero ─────────────────────────────── */}
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

      {/* ── Info grid ───────────────────────────────── */}
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

      {/* ── Edit form ───────────────────────────────── */}
      <div className="pt-form-card">
        <p className="pt-card-title">
          <UserOutlined /> Cập nhật thông tin
        </p>

        {locked ? (
          <div className="pt-locked-notice">
            <SafetyOutlined className="pt-locked-notice__icon" />
            <span>Vé đã xác nhận — không thể chỉnh sửa thêm.</span>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <div className="pt-form-grid">
              <Form.Item
                label="Tên hành khách"
                name="passengerName"
                rules={[{ required: true, message: "Nhập tên hành khách" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn An" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="contactPhone"
                rules={[{ required: true, message: "Nhập số điện thoại" }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="0987654321" />
              </Form.Item>

              <Form.Item
                label="Email liên hệ"
                name="contactEmail"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Email không hợp lệ",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="example@domain.com"
                />
              </Form.Item>

              <Form.Item
                label="Điểm lên xe"
                name="pickup"
                rules={[{ required: true, message: "Nhập điểm lên xe" }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Bến xe Mỹ Đình"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Điểm xuống xe"
              name="dropoff"
              rules={[{ required: true, message: "Nhập điểm xuống xe" }]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="Bến xe Miền Đông"
              />
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

// ─── Main component ───────────────────────────────────────
export const ProfileTicket = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedId, setSelectedId] = useState<string | null>(
    INITIAL_BOOKINGS[0].id, // mặc định chọn item đầu
  );

  const activeBooking = bookings.find((b) => b.id === selectedId) ?? null;

  const handleSave = (id: string, values: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...values } : b)),
    );
  };

  return (
    <div className="profile-ticket">
      {/* ── Page header ─────────────────────────────────── */}
      <div className="profile-ticket__header">
        <div className="pt-header__text">
          <h2 className="pt-header__title">Vé đã đặt</h2>
          <p className="pt-header__desc">
            Xem và cập nhật thông tin cho từng chuyến xe.
          </p>
        </div>
        <span className="pt-header__count">{bookings.length} vé</span>
      </div>

      {/* ── Master-detail layout ─────────────────────────── */}
      <div className="profile-ticket__layout">
        {/* Left: list */}
        <aside className="profile-ticket__list">
          {bookings.map((b) => (
            <BookingListItem
              key={b.id}
              booking={b}
              isActive={b.id === selectedId}
              onClick={() => setSelectedId(b.id)}
            />
          ))}
        </aside>

        {/* Right: detail */}
        <main className="profile-ticket__detail-pane">
          {activeBooking ? (
            <BookingDetail booking={activeBooking} onSave={handleSave} />
          ) : (
            <Empty description="Chọn một vé để xem chi tiết" />
          )}
        </main>
      </div>
    </div>
  );
};
