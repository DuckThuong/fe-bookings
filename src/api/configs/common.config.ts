import axiosClient from "../axiosClient";

export interface UploadImageResponse {
  imageUrl: string;
  fileName: string;
  size: number;
  mimeType: string;
}

const USE_MOCK = true;

export const uploadImage = async (
  formData: FormData,
): Promise<UploadImageResponse> => {
  if (USE_MOCK) {
    // Mock upload: convert to data URL để preview được ngay
    const file = formData.get("file") as File | null;
    if (!file) {
      throw new Error("Không có file đính kèm.");
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Không thể đọc file."));
      reader.readAsDataURL(file);
    });
    return {
      imageUrl: dataUrl,
      fileName: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
    };
  }

  const response = await axiosClient.post<UploadImageResponse>(
    "/uploads/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
