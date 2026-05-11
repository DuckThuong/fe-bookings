import { Empty } from "antd";
import { TripCard } from "../TripCard";
import type { Trip } from "@/common/types/ticket";

interface TripListProps {
  trips: Trip[];
  onBook: (trip: Trip) => void;
}

export const TripList = ({ trips, onBook }: TripListProps) => {
  if (trips.length === 0) {
    return (
      <Empty
        className="trip-list__empty"
        description="Không tìm thấy chuyến xe phù hợp"
      />
    );
  }

  return (
    <div className="trip-list">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} onBook={onBook} />
      ))}
    </div>
  );
};
