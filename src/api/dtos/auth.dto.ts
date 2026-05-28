export interface SignInPayloadDto {
  phoneNumber: string;

  password: string;
}

export interface SignUpPayloadDto {
  name: string;

  phone: string;

  password: string;

  confirm_password: string;

  acceptRole: number;

  email: string;

  dateOfBirth: string;

  gender: number;
}

export interface AuthResponseDto {
  accessToken: string;
}
