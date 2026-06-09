export enum UserStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  BLOCKED = 2,
}

export enum UserRole {
  ADMIN = 0,
  OWNER = 1,
  USER = 2,
}

export interface UpdateUserProfilePayloadDto {
  userName?: string;
  userDob?: string;
  userGender?: number;
  userAvatar?: string;
  userPhone?: string;
  userEmail?: string;
}

export interface UserProfileResponseDto {
  id: number;
  userCode: string;
  userName: string;
  userDob: string;
  userGender: number;
  userPhone: string;
  userEmail: string;
  userAvatar: string;
  userRole: UserRole;
  userStatus: UserStatus;
  userIsEmailVerified: boolean;
  ticketCount?: number;
  bookingCount?: number;
  totalPaid?: number;
  rank?: string;
  spentAmount?: number;
  nextRank?: string;
  nextRankThreshold?: number;
  rankProgressPercent?: number;
  lastBookingAt?: string;
  pendingTicketCount?: number;
  refundCount?: number;
}
