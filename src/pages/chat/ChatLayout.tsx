import { HomeHeader } from "@/components/TopBar";
import { Outlet } from "react-router";
import "./style.scss";

export const ChatLayout = () => (
  <>
    <HomeHeader />
    <Outlet />
  </>
);
