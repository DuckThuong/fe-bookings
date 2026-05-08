import { OPERATORS, PROMOS, SERVICES, TOP_TRIPS } from "@/common/types/home";
import { HeroBanner } from "../components/HeroBanner";
import { HomeHeader } from "../components/HomeHeader";
import { PromoCarousel } from "../components/PromoCarousel";
import { ServiceGrid } from "../components/ServiceGrid";
import { TopOperators } from "../components/TopOperators";
import { TopTrips } from "../components/TopTrips";
import "./style.scss";

const FAKE_USER = {
  userName: "Nguyễn Văn A",
  notifCount: 3,
};

export const HomePage = () => {
  return (
    <div className="home-page">
      <HomeHeader
        userName={FAKE_USER.userName}
        notifCount={FAKE_USER.notifCount}
      />

      <main className="home-main">
        <HeroBanner />

        <div className="home-content">
          <ServiceGrid data={SERVICES} />
          <PromoCarousel data={PROMOS} />
          <TopOperators data={OPERATORS} />
          <TopTrips data={TOP_TRIPS} />
        </div>
      </main>
    </div>
  );
};
