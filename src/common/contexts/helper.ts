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
