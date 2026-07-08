import { Upload } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { getBase64 } from "../../../../../common/utils/profile.utils";
import "./AvatarUploader.scss";

interface AvatarUploaderProps {
  avatarUrl: string;
  initials: string;
  onUpload: (url: string) => void;
}

export const AvatarUploader = ({
  avatarUrl,
  initials,
  onUpload,
}: AvatarUploaderProps) => {
  const handleBeforeUpload = async (file: File) => {
    const url = await getBase64(file);
    onUpload(url);
    return false;
  };

  return (
    <div className="pi-avatar-wrap">
      <div className="pi-avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="pi-avatar__img" />
        ) : (
          <span className="pi-avatar__initials">{initials}</span>
        )}

        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
        >
          <button
            className="pi-avatar__upload-btn"
            aria-label="Thay ảnh đại diện"
          >
            <CameraOutlined />
          </button>
        </Upload>
      </div>

      <div className="pi-avatar__meta">
        <p className="pi-avatar__hint">JPG, PNG — tối đa 5MB</p>
      </div>
    </div>
  );
};
