export interface MasterPayloadDto {
  type: string;
  code: string;
}

export interface MasterResponseDto {
  id: number;
  name: string;
  rule: string;
  sort: number;
  type: string;
  code: string;
}
