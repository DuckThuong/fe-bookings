import type { BookingPageData } from "@/common/types/booking";

/**
 * Get the label for a pickup point by its value
 */
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

/**
 * Get the label for a dropoff point by its value
 */
export const getDropoffPointLabel = (
  passenger: BookingPageData["passenger"],
  value?: string,
): string => {
  const targetValue = value ?? passenger.dropoffPointDefault;
  return (
    passenger.dropoffPointOptions.find((o) => o.value === targetValue)
      ?.label ?? "—"
  );
};
