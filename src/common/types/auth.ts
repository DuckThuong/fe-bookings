export type Gender = "male" | "female" | "other";
export type SubmitStatus = "idle" | "loading" | "success";
export type FieldState = "idle" | "valid" | "error";

export interface SignInData {
  fullName: string;
  email: string;
  phone: string;
  isAcceptedTerms: boolean;
  gender: Gender;
}
