import { useEffect, useState } from "react";
import "./style.scss";
import { ProfileSideBar } from "../components/ProfileSideBar";
import { ProfileSummary } from "./Page1";
import { ProfileInformation } from "./Page2";
import { ProfileTicket } from "./Page3";
import { ProfilePayment } from "./Page4";
import { ProfileSettings } from "./Page5";
import { HomeHeader } from "@/components/TopBar";
import { useLocation, useNavigate } from "react-router";
import { ROUTER_PATH } from "@/routers/Route";
import { CompanyRegistrationPage } from "@/pages/company-registration/CompanyRegistrationPage";

export const ProfilePage = () => {
  const location = useLocation();
  const initialTab = location.state?.tab || "overview";
  const [activeKey, setActiveKey] = useState<string>(initialTab);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeKey === "messages") {
      navigate(ROUTER_PATH.CHAT);
    }
  }, [activeKey, navigate]);

  const renderContent = () => {
    switch (activeKey) {
      case "account":
        return (
          <ProfileInformation onOpenPayment={() => setActiveKey("payment")} />
        );
      case "company-registration":
        return <CompanyRegistrationPage />;
      case "overview":
        return <ProfileSummary onEdit={() => setActiveKey("account")} />;
      case "trips":
        return <ProfileTicket />;
      case "payment":
        return <ProfilePayment />;
      case "settings":
        return <ProfileSettings />;
      default:
        return <ProfileSummary onEdit={() => setActiveKey("account")} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate(ROUTER_PATH.WELCOME);
  };

  return (
    <>
      <HomeHeader />
      <div className="profile-page">
        <div className="profile-page__wrapper">
          <ProfileSideBar
            selectedKey={activeKey}
            onChange={setActiveKey}
            onLogout={handleLogout}
          />

          <main className="profile-page__content">{renderContent()}</main>
        </div>
      </div>
    </>
  );
};
