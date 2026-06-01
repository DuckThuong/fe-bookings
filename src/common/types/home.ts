import type { MasterResponseDto } from "@/api/dtos/master.dto";

export interface Service {
  id: string;
  icon: string;
  label: string;
  desc: string;
  tag?: string;
  tagColor?: "amber" | "green" | "red";
}

export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: string;
  expiry: string;
  bg: string;
  textColor?: string;
}

export interface Operator {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  routes: string;
  badge?: string;
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  operator: string;
  operatorLogo: string;
  departure: string;
  duration: string;
  seats: number;
  price: number;
  type: string;
  rating: number;
}

export interface Hotel {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  address: string;
}

export interface Tour {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  address: string;
}

export interface Transport {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  address: string;
}

export interface Activity {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  address: string;
}

export interface Food {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  address: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  address: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface SupportContact {
  id: string;
  label: string;
  value: string;
  note: string;
}

export const mapTopTripsFromMaster = (items: MasterResponseDto[]): Trip[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const trip = JSON.parse(item.rule) as Trip;
        return [{ ...trip, id: trip.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapServicesFromMaster = (items: MasterResponseDto[]): Service[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const service = JSON.parse(item.rule) as Service;
        return [{ ...service, id: service.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapPromosFromMaster = (items: MasterResponseDto[]): Promo[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const promo = JSON.parse(item.rule) as Promo;
        return [{ ...promo, id: promo.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapOperatorsFromMaster = (
  items: MasterResponseDto[],
): Operator[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const operator = JSON.parse(item.rule) as Operator;
        return [{ ...operator, id: operator.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapTripsFromMaster = (items: MasterResponseDto[]): Trip[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const trip = JSON.parse(item.rule) as Trip;
        return [{ ...trip, id: trip.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapHotelsFromMaster = (items: MasterResponseDto[]): Hotel[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const hotel = JSON.parse(item.rule) as Hotel;
        return [{ ...hotel, id: hotel.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapToursFromMaster = (items: MasterResponseDto[]): Tour[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const tour = JSON.parse(item.rule) as Tour;
        return [{ ...tour, id: tour.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapTransportsFromMaster = (
  items: MasterResponseDto[],
): Transport[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const transport = JSON.parse(item.rule) as Transport;
        return [{ ...transport, id: transport.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapActivitiesFromMaster = (
  items: MasterResponseDto[],
): Activity[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const activity = JSON.parse(item.rule) as Activity;
        return [{ ...activity, id: activity.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapFoodsFromMaster = (items: MasterResponseDto[]): Food[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const food = JSON.parse(item.rule) as Food;
        return [{ ...food, id: food.id ?? item.code }];
      } catch {
        return [];
      }
    });

export const mapShopsFromMaster = (items: MasterResponseDto[]): Shop[] =>
  [...items]
    .sort((a, b) => a.sort - b.sort)
    .flatMap((item) => {
      try {
        const shop = JSON.parse(item.rule) as Shop;
        return [{ ...shop, id: shop.id ?? item.code }];
      } catch {
        return [];
      }
    });
