export interface ProfileItem {
  key: number;
  icon: any;
  label: string;
  href: string;
}

export interface ProfileLocationFilter {
  searchValue?: string;
  hasRent?: number;
  locationType?: string;
  typeName?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressRegion?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  page?: number;
  limit?: number;
}
