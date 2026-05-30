import { searchTrips } from "@/api/configs/trips.config";
import type { SearchTripsParams } from "@/api/dtos/trips.dto";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
} from "@/common/constants/constants";
import {
  type FilterKey,
  type SeatType,
  type SortKey,
  type Trip,
} from "@/common/types/ticket";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { BookingHero } from "../../components/Page2/BookingHero";
import { FilterBar } from "../../components/Page2/FilterBar";
import { SearchCard } from "../../components/Page2/SearchCard";
import { TripList } from "../../components/Page2/TripList";
import "./style.scss";

const PAGE_SIZE = 10;

type TripSearchState = {
  fromCity: string;
  fromStation: string;
  toCity: string;
  toStation: string;
  date: string;
  passengers: number;
  seatType: SeatType;
};

const INITIAL_SEARCH: TripSearchState = {
  fromCity: "Hà Nội",
  fromStation: "Bến xe Mỹ Đình",
  toCity: "TP. Hồ Chí Minh",
  toStation: "Bến xe Miền Đông",
  date: dayjs().format("DD/MM/YYYY"),
  passengers: 1,
  seatType: "all",
};

const buildSearchParams = (
  pageSize: number,
): SearchTripsParams => ({
  page: 1,
  pageSize,
});

export const TripPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  const [searchState, setSearchState] =
    useState<TripSearchState>(INITIAL_SEARCH);
  const [activeFilters, setFilters] = useState<FilterKey[]>(["all"]);
  const [sortKey, setSort] = useState<SortKey>("price");
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const queryParams = useMemo(
    () => buildSearchParams(pageSize),
    [pageSize],
  );

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["tripSearch", queryParams],
    queryFn: () => searchTrips(queryParams),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    setLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setLoading]);

  useEffect(() => {
    if (!isError) return;

    let message = DEFAULT_MESSAGE;
    if (isAxiosError(error)) {
      const apiMessage = error.response?.data?.message;
      if (typeof apiMessage === "string") {
        message = apiMessage;
      } else if (Array.isArray(apiMessage) && apiMessage[0]) {
        message = apiMessage[0];
      }
    }
    showNotification(message, NOTI_ERROR);
  }, [isError, error, showNotification]);

  const trips: Trip[] = data?.trips ?? [];
  const resultCount = data?.meta.resultCount ?? 0;
  const hasMoreTrips = data?.meta.hasMore ?? false;

  const handleSearch = (params: {
    from: { city: string; station: string };
    to: { city: string; station: string };
    date: string;
    passengers: number;
    seatType: SeatType;
  }) => {
    setSearchState({
      fromCity: params.from.city,
      fromStation: params.from.station,
      toCity: params.to.city,
      toStation: params.to.station,
      date: params.date,
      passengers: params.passengers,
      seatType: params.seatType,
    });
    setPageSize(PAGE_SIZE);
  };

  const handleToggleFilter = (key: FilterKey) => {
    setPageSize(PAGE_SIZE);
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
        date: searchState.date,
        trip,
      },
    });
  };

  const handleLoadMore = () => {
    setPageSize((prev) => prev + PAGE_SIZE);
  };

  const handleSortChange = (nextSort: SortKey) => {
    setSort(nextSort);
    setPageSize(PAGE_SIZE);
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
          activeFilters={activeFilters}
          sortKey={sortKey}
          resultCount={resultCount}
          from={searchState.fromCity}
          to={searchState.toCity}
          date={searchState.date}
          onToggleFilter={handleToggleFilter}
          onSortChange={handleSortChange}
        />

        <TripList trips={trips} onBook={handleBook} />

        <div className="booking-page__actions">
          {hasMoreTrips && (
            <Button
              className="booking-page__action-btn booking-page__action-btn--primary"
              type="primary"
              onClick={handleLoadMore}
              loading={isFetching && !isLoading}
            >
              Xem thêm {Math.min(PAGE_SIZE, resultCount - trips.length)} chuyến
            </Button>
          )}

          <ScrollTopButton className="booking-page__action-btn booking-page__action-btn--ghost" />
        </div>
      </div>
    </div>
  );
};
