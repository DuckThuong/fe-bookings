import axiosClient from "../axiosClient";
import type {
  CreateCompanyRegistrationDto,
  CompanyRegistrationResponseDto,
} from "../dtos/company-registration.dto";

export const COMPANY_REGISTRATION_API_PATH = {
  CREATE: "/company-registrations",
  MY_REGISTRATION: "/company-registrations/me",
};

export const CompanyRegistrationEndPoints = {
  CREATE_COMPANY_REGISTRATION: "create-company-registration",
  GET_MY_REGISTRATION: "my-company-registration",
};

export const createCompanyRegistration = async (
  payload: CreateCompanyRegistrationDto,
): Promise<CompanyRegistrationResponseDto> => {
  const response = await axiosClient.post(
    COMPANY_REGISTRATION_API_PATH.CREATE,
    payload,
  );
  return response.data;
};

export const getMyCompanyRegistration = async (): Promise<CompanyRegistrationResponseDto | null> => {
  const response = await axiosClient.get(
    COMPANY_REGISTRATION_API_PATH.MY_REGISTRATION,
  );
  return response.data;
};
