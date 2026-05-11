import { PROMOS } from "@/common/types/home";
import { HomeHeader } from "@/components/TopBar";
import { Button } from "antd";
import "./style.scss";

const FAKE_USER = {
  userName: "Nguyễn Văn A",
  notifCount: 3,
};

export const PromosPage = () => {
  return (
    <div className="promos-page">
      <HomeHeader
        userName={FAKE_USER.userName}
        notifCount={FAKE_USER.notifCount}
      />

      <main className="promos-main">
        <section className="promos-hero">
          <p className="promos-hero__eyebrow">Ưu đãi mới nhất</p>
          <h1 className="promos-hero__title">Khuyến mãi dành cho bạn</h1>
          <p className="promos-hero__sub">
            Cập nhật mã giảm giá mỗi ngày. Săn ưu đãi để đặt vé tiết kiệm hơn.
          </p>
        </section>

        <section className="promos-list">
          {PROMOS.map((promo) => (
            <article
              key={promo.id}
              className={`promo-item promo-item--${promo.id}`}
            >
              <div className="promo-item__head">
                <span className="promo-item__discount">{promo.discount}</span>
                <span className="promo-item__expiry">HSD: {promo.expiry}</span>
              </div>

              <h3 className="promo-item__title">{promo.title}</h3>
              <p className="promo-item__sub">{promo.subtitle}</p>

              <div className="promo-item__code-wrap">
                <span className="promo-item__code">{promo.code}</span>
                <Button className="promo-item__copy-btn" type="default" size="small">
                  Sao chép mã
                </Button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

