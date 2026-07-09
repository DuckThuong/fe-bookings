export interface MasterPayloadDto {
  type: string;
  code?: string;
}

export interface MasterResponseDto {
  id: number;
  name: string;
  rule: string;
  sort: number;
  type: string;
  code: string;
}

export interface MasterDataItem {
  id: number;
  type: string;
  code: string;
  name: string;
  rule?: string;
  sort: number;
}

export interface MasterDataAllResponse {
  driverStatuses: MasterDataItem[];
  driverLicenses: MasterDataItem[];
  vehicleStatuses: MasterDataItem[];
  vehicleTypes: MasterDataItem[];
  routeStatuses: MasterDataItem[];
  customerStatuses: MasterDataItem[];
  customerTiers: MasterDataItem[];
  reportStatuses: MasterDataItem[];
  reportTypes: MasterDataItem[];
  seatTypes: MasterDataItem[];
  registrationStatuses: MasterDataItem[];
  bookingStatuses: MasterDataItem[];
}
