import { Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { WelcomePage } from "../pages/auth/pages/WelcomePage";
import { Login } from "@/pages/auth/pages/Login";
import { SignIn } from "@/pages/auth/pages/SignIn";
import { OtpConfirm } from "@/pages/auth/pages/OtpConfirm";
import { Finish } from "@/pages/auth/pages/Finish";
import { HomePage } from "@/pages/home/pages/Page1";
import { TripPage } from "@/pages/home/pages/Page2";

export const WebRouter = () => (
  <Routes>
    {/* auth */}
    <Route path={ROUTER_PATH.WELCOME} element={<WelcomePage />} />
    <Route path={ROUTER_PATH.LOGIN} element={<Login />} />
    <Route path={ROUTER_PATH.SIGNIN} element={<SignIn />} />
    <Route path={ROUTER_PATH.OTP_CONFIRM} element={<OtpConfirm />} />
    <Route path={ROUTER_PATH.FINISH} element={<Finish />} />
    {/* home */}
    <Route path={ROUTER_PATH.HOME} element={<HomePage />} />
    <Route path={ROUTER_PATH.TRIP} element={<TripPage />} />
  </Routes>
);
