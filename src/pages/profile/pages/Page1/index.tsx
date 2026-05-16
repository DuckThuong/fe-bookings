import { Button, Col, Progress, Row, Typography } from "antd";
import "./style.scss";

const { Title, Paragraph, Text } = Typography;

const summaryCards = [
  { label: "Số chuyến đã đặt", value: "14 chuyến" },
  { label: "Điểm thưởng", value: "2.560 điểm" },
  { label: "Lượt truy cập", value: "1.248" },
];

const recentTrips = [
  {
    title: "Hà Nội → Sapa",
    date: "12 Tháng 5, 2026",
    status: "Đã hoàn thành",
    note: "Xe giường nằm, 2 vé",
  },
  {
    title: "Hồ Chí Minh → Đà Lạt",
    date: "24 Tháng 5, 2026",
    status: "Sắp tới",
    note: "Xe limousine, 1 vé",
  },
];

export const ProfileSummary = ({ onEdit }: { onEdit?: () => void }) => {
  return (
    <div className="profile-summary">
      <section className="profile-summary__hero">
        <div>
          <Title className="profile-summary__hero-title">Tổng quan</Title>
          <Paragraph className="profile-summary__hero-description">
            Xem nhanh thông tin tài khoản, chuyến đi và hoạt động gần đây của
            bạn.
          </Paragraph>
        </div>

        <Button type="primary" size="large" onClick={onEdit}>
          Cập nhật hồ sơ
        </Button>
      </section>

      <div className="profile-summary__cards">
        {summaryCards.map((card) => (
          <div key={card.label} className="profile-summary__card">
            <div className="profile-summary__card-title">{card.label}</div>
            <div className="profile-summary__card-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="profile-summary__section">
        <div className="profile-summary__section-title">Hoạt động gần đây</div>
        <div className="profile-summary__activity">
          <div className="profile-summary__activity-list">
            {recentTrips.map((trip) => (
              <div key={trip.title} className="profile-summary__activity-item">
                <div className="profile-summary__activity-item-header">
                  <div className="profile-summary__activity-item-title">
                    {trip.title}
                  </div>
                  <Text type="secondary">{trip.status}</Text>
                </div>
                <Text className="profile-summary__activity-item-meta">
                  {trip.date}
                </Text>
                <Text className="profile-summary__activity-item-meta">
                  {trip.note}
                </Text>
              </div>
            ))}
          </div>

          <div className="profile-summary__activity-sidebar">
            <div className="profile-summary__activity-sidebar-card">
              <div className="profile-summary__activity-sidebar-title">
                Tiến độ thành viên
              </div>
              <div className="profile-summary__activity-progress">
                <Text>Đã đạt</Text>
                <Text strong>68%</Text>
              </div>
              <Progress percent={68} showInfo={false} strokeColor="#1890ff" />
              <Text type="secondary">Còn 32% nữa để lên hạng Kim Cương</Text>
            </div>

            <div className="profile-summary__activity-sidebar-card">
              <div className="profile-summary__activity-sidebar-title">
                Lời nhắc nhanh
              </div>
              <ul>
                <li>Hoàn tất thông tin thanh toán</li>
                <li>Kiểm tra lại chuyến đi sắp tới</li>
                <li>Nhận ưu đãi khi đặt tiếp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
