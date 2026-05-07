export const AUTH_FLOWTYPE = {
  FORGOT: 1,
  SIGN_IN: 2,
  SIGN_UP: 3,
};

export const NOTI_ERROR = "error";
export const NOTI_SUCCESS = "success";
export const DEFAULT_MESSAGE = "Đã xảy ra lỗi.";
export const TYPE_LOG_OUT = 99;

export const RENTER_STEP = {
  PICK_TYPE: 1,
  FILL_INFORMATION: 2,
  FILL_ADDRESS: 3,
  FILL_OWNER: 4,
  CONFIRM: 5,
  SUCCESS: 6,
};

export const MessageTypeEnum = {
  RENT: "RENT",
  CONTACT: "CONTACT",
  NORMAL: "NORMAL",
};

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
}

export const DATE_FORMAT = "YYYY/MM/DD";

export const DOUBLE_DOT = " : ";

export const USER_ROLE = {
  ADMIN: 0,
  OWNER: 1,
  USER: 2,
};

export const RENT_TYPE = {
  MOTEL: "motel",
  APARTMENT: "apartment",
  OFFICE: "office",
  FULL_HOUSE: "full_house",
  VENUE: "venue",
} as const;

export const LOCATION_TYPE = {
  NORTH: "north",
  CENTRAL: "central",
  SOUTH: "south",
  WEST: "west",
} as const;

export type RentType = (typeof RENT_TYPE)[keyof typeof RENT_TYPE];
export type LocationType = (typeof LOCATION_TYPE)[keyof typeof LOCATION_TYPE];
