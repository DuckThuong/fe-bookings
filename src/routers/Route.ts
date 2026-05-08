const ROUTER = "";

export const ROUTER_NAME = {
  // auth
  WELCOME: "",
  LOGIN: "login",
  SIGNIN: "signin",
  OTP_CONFIRM: "otp-confirm",
  FINISH: "finish",
  // home
  HOME: "home",
};

export const ROUTER_PATH = {
  // auth
  WELCOME: `${ROUTER}/${ROUTER_NAME.WELCOME}`,
  LOGIN: `${ROUTER}/${ROUTER_NAME.LOGIN}`,
  SIGNIN: `${ROUTER}/${ROUTER_NAME.SIGNIN}`,
  OTP_CONFIRM: `${ROUTER}/${ROUTER_NAME.OTP_CONFIRM}`,
  FINISH: `${ROUTER}/${ROUTER_NAME.FINISH}`,
  // home
  HOME: `${ROUTER}/${ROUTER_NAME.HOME}`,
};
