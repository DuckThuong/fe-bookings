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
  TRIP: "trip",
  BOOKING: "booking",
  PROMOS: "promos",
  SUPPORT: "support",
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
  TRIP: `${ROUTER}/${ROUTER_NAME.TRIP}`,
  BOOKING: `${ROUTER}/${ROUTER_NAME.BOOKING}`,
  PROMOS: `${ROUTER}/${ROUTER_NAME.PROMOS}`,
  SUPPORT: `${ROUTER}/${ROUTER_NAME.SUPPORT}`,
};
