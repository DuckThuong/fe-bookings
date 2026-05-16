import type { BookingPageData } from "@/common/types/booking";

export const getPickupPointLabel = (
  passenger: BookingPageData["passenger"],
  value?: string,
): string => {
  const targetValue = value ?? passenger.pickupPointDefault;
  return (
    passenger.pickupPointOptions.find((o) => o.value === targetValue)?.label ??
    "—"
  );
};

export const getDropoffPointLabel = (
  passenger: BookingPageData["passenger"],
  value?: string,
): string => {
  const targetValue = value ?? passenger.dropoffPointDefault;
  return (
    passenger.dropoffPointOptions.find((o) => o.value === targetValue)?.label ??
    "—"
  );
};
