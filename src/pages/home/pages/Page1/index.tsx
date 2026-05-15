import { OPERATORS, PROMOS, SERVICES, TOP_TRIPS } from "@/common/types/home";
import { HeroBanner } from "../../components/Page1/HeroBanner";
import { HomeHeader } from "../../../../components/TopBar";
import { PromoCarousel } from "../../components/Page1/PromoCarousel";
import { ServiceGrid } from "../../components/Page1/ServiceGrid";
import { TopOperators } from "../../components/Page1/TopOperators";
import { TopTrips } from "../../components/Page1/TopTrips";
import "./style.scss";

const FAKE_USER = {
  userName: "Nguyễn Văn A",
  notifCount: 3,
};

export const HomePage = () => {
  return (
    <div className="home-page">
      <HomeHeader />

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
