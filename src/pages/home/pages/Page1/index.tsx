import { findByType } from "@/api/configs/master.config";
import type { MasterResponseDto } from "@/api/dtos/master.dto";
import { TYPE_OPERATOR, TYPE_PROMO, TYPE_SERVICE, TYPE_TOP_TRIP } from "@/common/types/common";
import { mapOperatorsFromMaster, mapPromosFromMaster, mapServicesFromMaster, mapTopTripsFromMaster, type Operator, type Promo, type Service, type Trip } from "@/common/types/home";
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
  const [operatorsData, setOperatorsData] = useState<Operator[]>([]);
  const [tripsData, setTripsData] = useState<Trip[]>([]);

  const { data: topTrips, isLoading: isLoadingTopTrips } = useQuery({
    queryKey: ["topTrips", TYPE_TOP_TRIP],
    queryFn: () => findByType({ type: TYPE_TOP_TRIP, code: "" }),
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", TYPE_SERVICE],
    queryFn: () => findByType({ type: TYPE_SERVICE, code: "" }),
  });

  const { data: promos, isLoading: isLoadingPromos } = useQuery({
    queryKey: ["promos", TYPE_PROMO],
    queryFn: () => findByType({ type: TYPE_PROMO, code: "" }),
  });

  const { data: operators, isLoading: isLoadingOperators } = useQuery({
    queryKey: ["operators", TYPE_OPERATOR],
    queryFn: () => findByType({ type: TYPE_OPERATOR, code: "" }),
  });

  const isLoading = isLoadingTopTrips || isLoadingServices || isLoadingPromos || isLoadingOperators;

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
    if (!operators) return;
    const items = Array.isArray(operators) ? operators : [operators];
    setOperatorsData(mapOperatorsFromMaster(items as MasterResponseDto[]));
  }, [operators]);

  useEffect(() => {
    if (!topTrips) return;

    const items = Array.isArray(topTrips) ? topTrips : [topTrips];
    setTripsData(mapTopTripsFromMaster(items as MasterResponseDto[]));
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
