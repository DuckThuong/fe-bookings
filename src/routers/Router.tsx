import { Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { WelcomePage } from "../pages/auth/pages/WelcomePage";

export const WebRouter = () => (
  <Routes>
    <Route path={ROUTER_PATH.WELCOME} element={<WelcomePage />} />
  </Routes>
);
