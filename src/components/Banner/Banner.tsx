import { Button } from "antd";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FormSearch } from "../FormSearch/formSearch";
import { ROUTER_PATH } from "../../router/Route";
import "./Banner.scss";

interface BannerProps {
  readonly image?: string;
  readonly title?: string;
  readonly description?: string;
  readonly onSearch?: (value: string) => void;
}

interface BannerLocationState {
  rent?: string;
  location?: string;
}

const DEFAULT_TITLE = "Tìm kiếm không gian phù hợp";
const DEFAULT_DESCRIPTION =
  "Khám phá địa điểm theo khu vực, loại hình và nhu cầu của bạn.";

const DEFAULT_SEARCH_SUGGESTIONS = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Phú Quốc",
  "Căn hộ",
  "Văn phòng",
];

const LOCATIONS_ROUTE_SUGGESTIONS = [
  "Phòng trọ",
  "Căn hộ",
  "Văn phòng",
  "Nhà nguyên căn",
  "Hà Nội",
  "TP. Hồ Chí Minh",
];

const PROFILE_ROUTE_SUGGESTIONS = [
  "Lịch hẹn",
  "Hợp đồng",
  "Địa điểm của tôi",
  "Tin nhắn",
  "Doanh thu",
  "Đánh giá",
];

const RENTER_ROUTE_SUGGESTIONS = [
  "Đăng địa điểm mới",
  "Mô tả địa điểm",
  "Giá thuê",
  "Tiện ích",
  "Ảnh địa điểm",
  "Địa chỉ",
];

const RENT_QUERY_SUGGESTIONS: Record<string, string[]> = {
  motel: ["Phòng trọ giá rẻ", "Phòng trọ gần trường", "Phòng trọ có gác"],
  apartment: ["Căn hộ studio", "Căn hộ 1 phòng ngủ", "Căn hộ full nội thất"],
  office: ["Văn phòng nhỏ", "Coworking", "Văn phòng trung tâm"],
  "full-house": ["Nhà nguyên căn", "Nhà nhiều phòng ngủ", "Nhà có sân"],
  full_house: ["Nhà nguyên căn", "Nhà nhiều phòng ngủ", "Nhà có sân"],
  venue: ["Địa điểm tổ chức sự kiện", "Sảnh tiệc", "Phòng hội nghị"],
};

export const Banner = ({
  image,
  title,
  description,
  onSearch,
}: BannerProps) => {
  const location = useLocation();
  const hasImage = Boolean(image);

  const suggestions = useMemo(() => {
    const pathname = location.pathname;
    const routeState = (location.state as BannerLocationState | null) ?? null;
    const searchParams = new URLSearchParams(location.search);
    const scopedRent = searchParams.get("rent") ?? routeState?.rent;
    const scopedLocation = searchParams.get("location") ?? routeState?.location;

    if (pathname.startsWith(ROUTER_PATH.LOCATIONS)) {
      const normalizedRent = scopedRent
        ?.trim()
        .toLowerCase()
        .replace(/_/g, "-");
      if (normalizedRent && RENT_QUERY_SUGGESTIONS[normalizedRent]) {
        return RENT_QUERY_SUGGESTIONS[normalizedRent];
      }

      const normalizedLocation = scopedLocation?.trim();
      if (normalizedLocation) {
        return [
          normalizedLocation,
          ...LOCATIONS_ROUTE_SUGGESTIONS.filter(
            (suggestion) => suggestion !== normalizedLocation,
          ),
        ];
      }

      return LOCATIONS_ROUTE_SUGGESTIONS;
    }

    if (pathname.startsWith(ROUTER_PATH.RENTER)) {
      return RENTER_ROUTE_SUGGESTIONS;
    }

    if (pathname.startsWith(ROUTER_PATH.PROFILE)) {
      return PROFILE_ROUTE_SUGGESTIONS;
    }

    return DEFAULT_SEARCH_SUGGESTIONS;
  }, [location.pathname, location.search, location.state]);

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      return;
    }

    onSearch?.(value);
  };

  return (
    <div className={`banner${hasImage ? " banner--has-image" : ""}`}>
      {hasImage ? (
        <img className="banner__background-image" src={image} alt="" />
      ) : null}
      <div className="banner__overlay" />
      <div className="banner__content">
        <h1 className="banner__content-title">{title ?? DEFAULT_TITLE}</h1>
        <p className="banner__content-description">
          {description ?? DEFAULT_DESCRIPTION}
        </p>
        <div className="banner__content-search">
          <FormSearch
            label=""
            name="bannerSearch"
            placeholder="Tìm kiếm theo tên, địa chỉ..."
            onSearch={handleSearch}
            formItemProps={{ className: "banner__search-item" }}
            searchProps={{ enterButton: "Tìm kiếm" }}
          />
        </div>

        <div className="banner__suggestions">
          <span className="banner__suggestions-label">Gợi ý:</span>
          <div className="banner__suggestions-list">
            {suggestions.map((keyword) => (
              <Button
                key={keyword}
                className="banner__suggestions-item"
                type="text"
                onClick={() => handleSearch(keyword)}
              >
                {keyword}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
