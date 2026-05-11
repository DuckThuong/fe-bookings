import {
  FAKE_TRIPS,
  type FilterKey,
  type SortKey,
  type Trip,
} from "@/common/types/ticket";
import { HomeHeader } from "@/components/TopBar";
import { useState } from "react";
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

export const TripPage = () => {
  const [searchMeta, setSearchMeta] = useState(INITIAL_SEARCH);

  const [activeFilters, setFilters] = useState<FilterKey[]>(["all"]);
  const [sortKey, setSort] = useState<SortKey>("price");
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
  };

  const handleToggleFilter = (key: FilterKey) => {
    if (key === "all") {
      setFilters(["all"]);
      return;
    }
    setFilters((prev) => {
      const without = prev.filter((k) => k !== "all");
      return without.includes(key)
        ? without.filter((k) => k !== key) || ["all"]
        : [...without, key];
    });
  };

  const handleBook = (trip: Trip) => {
    console.log("Booking trip:", trip.id);
  };

  const displayedTrips = [...trips].sort((a, b) => {
    if (sortKey === "price") return a.price - b.price;
    if (sortKey === "rating") return b.operator.rating - a.operator.rating;
    if (sortKey === "duration") return a.duration.localeCompare(b.duration);
    return 0;
  });

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
          onSortChange={setSort}
        />

        <TripList trips={displayedTrips} onBook={handleBook} />
      </div>
    </div>
  );
};
