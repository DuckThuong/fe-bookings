import {
  FAKE_TRIPS,
  type FilterKey,
  type SortKey,
  type Trip,
} from "@/common/types/ticket";
import { ROUTER_PATH } from "@/routers/Route";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { HomeHeader } from "@/components/TopBar";
import { Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingHero } from "../../components/Page2/BookingHero";
import { FilterBar } from "../../components/Page2/FilterBar";
import { SearchCard } from "../../components/Page2/SearchCard";
import { TripList } from "../../components/Page2/TripList";
import "./style.scss";

const INITIAL_SEARCH = {
  from: "Hà Nội",
  to: "TP. Hồ Chí Minh",
  date: "11/05/2026",
};

const FAKE_USER = {
  userName: "Nguyễn Văn A",
  notifCount: 3,
};

const PAGE_SIZE = 10;

export const TripPage = () => {
  const navigate = useNavigate();
  const [searchMeta, setSearchMeta] = useState(INITIAL_SEARCH);

  const [activeFilters, setFilters] = useState<FilterKey[]>(["all"]);
  const [sortKey, setSort] = useState<SortKey>("price");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const trips: Trip[] = FAKE_TRIPS;

  const handleSearch = (params: {
    from: { city: string };
    to: { city: string };
    date: string;
  }) => {
    setSearchMeta({
      from: params.from.city,
      to: params.to.city,
      date: params.date,
    });
    setVisibleCount(PAGE_SIZE);
  };

  const handleToggleFilter = (key: FilterKey) => {
    if (key === "all") {
      setFilters(["all"]);
      return;
    }
    setFilters((prev) => {
      const without = prev.filter((k) => k !== "all");
      if (without.includes(key)) {
        const next = without.filter((k) => k !== key);
        return next.length ? next : ["all"];
      }
      return [...without, key];
    });
  };

  const handleBook = (trip: Trip) => {
    navigate(ROUTER_PATH.BOOKING, {
      state: {
        from: trip.departure.city,
        to: trip.arrival.city,
        date: searchMeta.date,
        trip,
      },
    });
  };

  const displayedTrips = [...trips].sort((a, b) => {
    if (sortKey === "price") return a.price - b.price;
    if (sortKey === "rating") return b.operator.rating - a.operator.rating;
    if (sortKey === "duration") return a.duration.localeCompare(b.duration);
    return 0;
  });
  const visibleTrips = displayedTrips.slice(0, visibleCount);
  const hasMoreTrips = visibleCount < displayedTrips.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, displayedTrips.length));
  };

  const handleSortChange = (nextSort: SortKey) => {
    setSort(nextSort);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="booking-page">
      <HomeHeader
        userName={FAKE_USER.userName}
        notifCount={FAKE_USER.notifCount}
      />
      <BookingHero />

      <div className="booking-page__search-wrap">
        <SearchCard onSearch={handleSearch} />
      </div>

      <div className="booking-page__content">
        <FilterBar
          activeFilters={activeFilters as FilterKey[]}
          sortKey={sortKey}
          resultCount={displayedTrips.length}
          from={searchMeta.from}
          to={searchMeta.to}
          date={searchMeta.date}
          onToggleFilter={handleToggleFilter}
          onSortChange={handleSortChange}
        />

        <TripList trips={visibleTrips} onBook={handleBook} />

        <div className="booking-page__actions">
          {hasMoreTrips && (
            <Button
              className="booking-page__action-btn booking-page__action-btn--primary"
              type="primary"
              onClick={handleLoadMore}
            >
              Xem thêm {Math.min(PAGE_SIZE, displayedTrips.length - visibleCount)}{" "}
              chuyến
            </Button>
          )}

          <ScrollTopButton className="booking-page__action-btn booking-page__action-btn--ghost" />
        </div>
      </div>
    </div>
  );
};
