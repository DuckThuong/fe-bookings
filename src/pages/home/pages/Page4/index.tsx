import { HomeHeader } from "@/components/TopBar";
import "./style.scss";

const FAQS = [
  {
    q: "Làm sao để đổi lịch chuyến đi?",
    a: "Bạn vào Chi tiết đơn hàng, chọn Đổi lịch. Hệ thống sẽ hiển thị các chuyến có thể đổi.",
  },
  {
    q: "Khi nào tôi nhận được hoàn tiền?",
    a: "Hoàn tiền thường trong 3-5 ngày làm việc, tuỳ ngân hàng hoặc phương thức thanh toán.",
  },
  {
    q: "Tôi quên mã đặt chỗ thì làm gì?",
    a: "Vào mục Chuyến đi của tôi hoặc liên hệ tổng đài với số điện thoại đã đặt vé.",
  },
];

const CONTACTS = [
  { label: "Hotline 24/7", value: "1900 1234", note: "Phí 1.000đ/phút" },
  { label: "Email hỗ trợ", value: "support@goride.vn", note: "Phản hồi trong 2h" },
  { label: "Live chat", value: "Chat trong ứng dụng", note: "08:00 - 22:00" },
];

const FAKE_USER = {
  userName: "Nguyễn Văn A",
  notifCount: 3,
};

export const SupportPage = () => {
  return (
    <div className="support-page">
      <HomeHeader />

      <main className="support-main">
        <section className="support-hero">
          <p className="support-hero__eyebrow">Trung tâm hỗ trợ</p>
          <h1 className="support-hero__title">Chúng tôi luôn sẵn sàng giúp bạn</h1>
          <p className="support-hero__sub">
            Tìm nhanh các câu hỏi thường gặp hoặc liên hệ trực tiếp với đội ngũ
            CSKH.
          </p>
        </section>

        <section className="support-grid">
          <div className="support-panel">
            <h2 className="support-panel__title">Câu hỏi thường gặp</h2>
            <div className="faq-list">
              {FAQS.map((item) => (
                <article className="faq-item" key={item.q}>
                  <h3 className="faq-item__q">{item.q}</h3>
                  <p className="faq-item__a">{item.a}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="support-panel">
            <h2 className="support-panel__title">Kênh liên hệ</h2>
            <div className="contact-list">
              {CONTACTS.map((item) => (
                <article className="contact-item" key={item.label}>
                  <span className="contact-item__label">{item.label}</span>
                  <strong className="contact-item__value">{item.value}</strong>
                  <span className="contact-item__note">{item.note}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

