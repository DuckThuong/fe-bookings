import { findByType } from "@/api/configs/master.config";
import { getHomeHighlights } from "@/api/configs/home.config";
import type { MasterResponseDto } from "@/api/dtos/master.dto";
import {
  HIGHLIGHT_TYPE_OPERATOR,
  HIGHLIGHT_TYPE_TRIP,
  TYPE_PROMO,
  TYPE_SERVICE,
} from "@/common/types/common";
import {
  mapPromosFromMaster,
  mapServicesFromMaster,
  type HomeTopOperator,
  type HomeTopTrip,
  type Promo,
  type Service,
} from "@/common/types/home";
import { useLoading } from "@/providers/loadingProvider";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HomeHeader } from "../../../../components/TopBar";
import { HeroBanner } from "../../components/Page1/HeroBanner";
import { PromoCarousel } from "../../components/Page1/PromoCarousel";
import { ServiceGrid } from "../../components/Page1/ServiceGrid";
import { TopOperators } from "../../components/Page1/TopOperators";
import { TopTrips } from "../../components/Page1/TopTrips";
import "./style.scss";

export const HomePage = () => {
  const { setLoading } = useLoading();
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [promosData, setPromosData] = useState<Promo[]>([]);
  const [operatorsData, setOperatorsData] = useState<HomeTopOperator[]>([]);
  const [tripsData, setTripsData] = useState<HomeTopTrip[]>([]);

  const { data: topOperators, isLoading: isLoadingTopOperators } = useQuery({
    queryKey: ["topOperators", HIGHLIGHT_TYPE_OPERATOR],
    queryFn: () =>
      getHomeHighlights({ type: HIGHLIGHT_TYPE_OPERATOR, limit: 10 }),
  });

  const { data: topTrips, isLoading: isLoadingTopTrips } = useQuery({
    queryKey: ["topTrips", HIGHLIGHT_TYPE_TRIP],
    queryFn: () => getHomeHighlights({ type: HIGHLIGHT_TYPE_TRIP, limit: 10 }),
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", TYPE_SERVICE],
    queryFn: () => findByType({ type: TYPE_SERVICE, code: "" }),
  });

  const { data: promos, isLoading: isLoadingPromos } = useQuery({
    queryKey: ["promos", TYPE_PROMO],
    queryFn: () => findByType({ type: TYPE_PROMO, code: "" }),
  });

  const isLoading =
    isLoadingTopOperators ||
    isLoadingTopTrips ||
    isLoadingServices ||
    isLoadingPromos;

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (!services) return;
    const items = Array.isArray(services) ? services : [services];
    setServicesData(mapServicesFromMaster(items as MasterResponseDto[]));
  }, [services]);

  useEffect(() => {
    if (!promos) return;
    const items = Array.isArray(promos) ? promos : [promos];
    setPromosData(mapPromosFromMaster(items as MasterResponseDto[]));
  }, [promos]);

  useEffect(() => {
    if (!topOperators?.operators) return;
    setOperatorsData(topOperators.operators);
  }, [topOperators]);

  useEffect(() => {
    if (!topTrips?.trips) return;
    setTripsData(topTrips.trips);
  }, [topTrips]);

  return (
    <div className="home-page">
      <HomeHeader />

      <main className="home-main">
        <HeroBanner />

        <div className="home-content">
          <ServiceGrid data={servicesData} />
          <PromoCarousel data={promosData} />
          <TopOperators data={operatorsData} />
          <TopTrips data={tripsData} />
        </div>
      </main>
    </div>
  );
};
