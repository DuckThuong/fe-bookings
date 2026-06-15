export type HomeHighlightType = "OPERATOR" | "TRIP";

export interface HomeHighlightOperator {
  id: number;
  code: string;
  name: string;
  shortName: string;
  logoColor: string;
  rating: number;
  reviewCount: string;
  totalTickets: number;
  activeTrips: number;
}

export interface HomeHighlightTripRoutePoint {
  time: string;
  city: string;
  station: string;
}

export interface HomeHighlightTripOperator {
  id: number;
  code: string;
  name: string;
  shortName: string;
  logoColor: string;
  rating: number;
  reviewCount: string;
}

export interface HomeHighlightTrip {
  id: number;
  code: string;
  name: string;
  operator: HomeHighlightTripOperator;
  departure: HomeHighlightTripRoutePoint;
  arrival: HomeHighlightTripRoutePoint;
  duration: string;
  vehicleType: string;
  price: number;
  seatsLeft: number;
  totalTickets: number;
}

export interface HomeHighlightsResponse {
  type: HomeHighlightType;
  limit: number;
  operators: HomeHighlightOperator[];
  trips: HomeHighlightTrip[];
}

export interface HomeHighlightsParams {
  type: HomeHighlightType;
  limit?: number;
}
