export const childrenPath = (path: string, param?: string) =>
  param ? path.replace(/:\w+\?/, param) : path.replace(/\/:\w+\?/, "");

export const validString = (value: string) => {
  if (!value) {
    return false;
  } else if (value.trim() === "") {
    return false;
  } else {
    return true;
  }
};

export const seatColor = (n: number) => {
  if (n <= 3) return "trip-card__seats--urgent";
  if (n <= 8) return "trip-card__seats--low";
  return "trip-card__seats--ok";
};
