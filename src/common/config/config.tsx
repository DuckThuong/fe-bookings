import { Link } from "react-router-dom";
import { ROUTER_PATH } from "../../router/Route";
import type { ProfileItem } from "../types/profile";
import location from "../../assets/images/profile/icn_location.svg";
import logout from "../../assets/images/profile/icn_logout.svg";
import profile from "../../assets/images/profile/icn_profile.svg";
import down from "../../assets/svg/icn-down_single.svg";
import bill from "../../assets/svg/profile/bill.svg";
import chat from "../../assets/svg/profile/chat.svg";
import contract from "../../assets/svg/profile/contract.svg";
import payment from "../../assets/svg/profile/payment.svg";
import { LOCATION_TYPE, RENT_TYPE, TYPE_LOG_OUT } from "../constants/constants";

export const items = () => [
  {
    key: 1,
    label: <Link to={ROUTER_PATH.HOME}>Trang chủ</Link>,
  },
  {
    key: 2,
    label: (
      <span>
        Loại hình <img src={down} alt="Logo" />
      </span>
    ),
    children: [
      {
        key: 21,
        value: RENT_TYPE.MOTEL,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ rent: RENT_TYPE.MOTEL, page: 1 }}
          >
            Phòng trọ
          </Link>
        ),
      },
      {
        key: 22,
        value: RENT_TYPE.APARTMENT,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ rent: RENT_TYPE.APARTMENT, page: 1 }}
          >
            Căn hộ
          </Link>
        ),
      },
      {
        key: 23,
        value: RENT_TYPE.OFFICE,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ rent: RENT_TYPE.OFFICE, page: 1 }}
          >
            Văn phòng
          </Link>
        ),
      },
      {
        key: 24,
        value: RENT_TYPE.FULL_HOUSE,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ rent: RENT_TYPE.FULL_HOUSE, page: 1 }}
          >
            Nhà nguyên căn
          </Link>
        ),
      },
      {
        key: 25,
        value: RENT_TYPE.VENUE,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ rent: RENT_TYPE.VENUE, page: 1 }}
          >
            Địa điểm tổ chức sự kiện
          </Link>
        ),
      },
    ],
  },
  {
    key: 3,
    label: (
      <span>
        Khu vực <img src={down} alt="Logo" />
      </span>
    ),
    children: [
      {
        key: 31,
        value: LOCATION_TYPE.NORTH,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ location: LOCATION_TYPE.NORTH, page: 1 }}
          >
            Miền Bắc
          </Link>
        ),
      },
      {
        key: 32,
        value: LOCATION_TYPE.CENTRAL,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ location: LOCATION_TYPE.CENTRAL, page: 1 }}
          >
            Miền Trung
          </Link>
        ),
      },
      {
        key: 33,
        value: LOCATION_TYPE.SOUTH,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ location: LOCATION_TYPE.SOUTH, page: 1 }}
          >
            Miền Nam
          </Link>
        ),
      },
      {
        key: 34,
        value: LOCATION_TYPE.WEST,
        label: (
          <Link
            to={ROUTER_PATH.LOCATIONS}
            state={{ location: LOCATION_TYPE.WEST, page: 1 }}
          >
            Miền Tây
          </Link>
        ),
      },
    ],
  },
  {
    key: 4,
    label: <Link to={ROUTER_PATH.MAP}>Bản đồ</Link>,
  },
  {
    key: 5,
    label: <span>Hỗ trợ</span>,
    children: [
      {
        key: 51,
        label: <Link to={ROUTER_PATH.SUPPORT}>Nhắn tin với Bookings</Link>,
      },
      {
        key: 52,
        label: <Link to={ROUTER_PATH.DOCS}>Hướng dẫn</Link>,
      },
    ],
  },
];

export const profileItems: ProfileItem[] = [
  {
    key: 1,
    icon: profile,
    label: "Thông tin cá nhân",
    href: ROUTER_PATH.PROFILE_INFORMATION,
  },
  {
    key: 2,
    icon: location,
    label: "Địa điểm của tôi",
    href: ROUTER_PATH.PROFILE_LOCATION,
  },
  {
    key: 3,
    icon: contract,
    label: "Hợp đồng của tôi",
    href: ROUTER_PATH.PROFILE_LOCATION,
  },
  {
    key: 4,
    icon: chat,
    label: "Đoạn chat",
    href: ROUTER_PATH.PROFILE_CHAT,
  },
  {
    key: 5,
    icon: bill,
    label: "Hóa đơn",
    href: ROUTER_PATH.PROFILE_LOCATION,
  },
  {
    key: 6,
    icon: payment,
    label: "Thanh toán",
    href: ROUTER_PATH.PROFILE_LOCATION,
  },
  {
    key: TYPE_LOG_OUT,
    icon: logout,
    label: "Đăng xuất",
    href: ROUTER_PATH.HOME,
  },
];
