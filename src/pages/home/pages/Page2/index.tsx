import {
  type FilterKey,
  type SortKey,
  type Trip,
} from "@/common/types/ticket";
import { ROUTER_PATH } from "@/routers/Route";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { HomeHeader } from "@/components/TopBar";
import { Alert, Button, Spin } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingHero } from "../../components/Page2/BookingHero";
import { FilterBar } from "../../components/Page2/FilterBar";
import { SearchCard } from "../../components/Page2/SearchCard";
import { TripList } from "../../components/Page2/TripList";
import { useClientCompanyTripsQuery, useClientRoadsQuery } from "@/features/catalog/hooks/useCatalogApi";
import { mapCompanyTripToTripCard } from "@/features/booking/utils/bookingMappers";
import { getApiErrorMessage } from "@/common/utils/apiError";
import type { SeatType } from "@/common/types/ticket";
import "./style.scss";

const INITIAL_SEARCH = {
  from: "HÃ  Ná»™i",
  to: "TP. Há»“ ChÃ­ Minh",
  date: "11/05/2026",
  passengers: 1,
};

const PAGE_SIZE = 10;

export const TripPage = () => {
  const navigate = useNavigate();
  const [searchMeta, setSearchMeta] = useState(INITIAL_SEARCH);
  const [activeFilters, setFilters] = useState<FilterKey[]>(["all"]);
  const [sortKey, setSort] = useState<SortKey>("price");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const roadFilters = useMemo(
    () => ({
      startPoint: searchMeta.from,
      endPoint: searchMeta.to,
      page: 1,
      limit: 1,
    }),
    [searchMeta.from, searchMeta.to],
  );

  const roadsQuery = useClientRoadsQuery(roadFilters);
  const roadId = roadsQuery.data?.items[0]?.id;

  const companyTripFilters = useMemo(
    () => ({
      roadId,
      minAvailableSeats: searchMeta.passengers,
      page: 1,
      limit: 100,
    }),
    [roadId, searchMeta.passengers],
  );

  const companyTripsQuery = useClientCompanyTripsQuery(
    companyTripFilters,
    Boolean(roadId),
  );

  const trips: Trip[] = useMemo(
    () =>
      companyTripsQuery.data?.items.map((item) =>
        mapCompanyTripToTripCard(item),
      ) ?? [],
    [companyTripsQuery.data?.items],
  );

  const handleSearch = (params: {
    from: { city: string };
    to: { city: string };
    date: string;
    passengers: number;
    seatType: SeatType;
  }) => {
    setSearchMeta({
      from: params.from.city,
      to: params.to.city,
      date: params.date,
      passengers: params.passengers,
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
    navigate(`${ROUTER_PATH.BOOKING}?tripId=${encodeURIComponent(trip.id)}`, {
      state: {
        tripId: trip.id,
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
    if (sortKey === "departure") {
      return a.departure.time.localeCompare(b.departure.time);
    }
    return 0;
  });
  const visibleTrips = displayedTrips.slice(0, visibleCount);
  const hasMoreTrips = visibleCount < displayedTrips.length;
  const isLoading =
    roadsQuery.isLoading ||
    roadsQuery.isFetching ||
    (Boolean(roadId) && (companyTripsQuery.isLoading || companyTripsQuery.isFetching));
  const apiError = roadsQuery.error ?? companyTripsQuery.error;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, displayedTrips.length));
  };

  const handleSortChange = (nextSort: SortKey) => {
    setSort(nextSort);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="booking-page">
      <HomeHeader />
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

        {apiError && (
          <Alert
            type="error"
            showIcon
            message={getApiErrorMessage(apiError)}
            style={{ marginBottom: 16 }}
          />
        )}

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <Spin />
          </div>
        ) : (
          <TripList trips={visibleTrips} onBook={handleBook} />
        )}

        <div className="booking-page__actions">
          {hasMoreTrips && (
            <Button
              className="booking-page__action-btn booking-page__action-btn--primary"
              type="primary"
              onClick={handleLoadMore}
            >
              Xem thÃªm {Math.min(PAGE_SIZE, displayedTrips.length - visibleCount)}{" "}
              chuyáº¿n
            </Button>
          )}

          <ScrollTopButton className="booking-page__action-btn booking-page__action-btn--ghost" />
        </div>
      </div>
    </div>
  );
};
