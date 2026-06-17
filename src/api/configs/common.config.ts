import axiosClient from "../axiosClient";

export interface UploadImageResponse {
  imageUrl: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export const uploadImage = async (
  formData: FormData,
): Promise<UploadImageResponse> => {
  const response = await axiosClient.post<UploadImageResponse>(
    "/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
