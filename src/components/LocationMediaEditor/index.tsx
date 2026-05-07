import { Dropdown, Modal, type MenuProps, Button } from "antd";
import { useState } from "react";
import type { EditableLocationMediaItem } from "../../features/locationCreation/media";
import "./style.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { Typography } from "antd";
const { Text } = Typography;

interface LocationMediaEditorProps {
  media: EditableLocationMediaItem[];
  isUploading?: boolean;
  uploadLabel?: string;
  emptyLabel?: string;
  inputId: string;
  accept?: string;
  multiple?: boolean;
  onUpload: (files: FileList) => void;
  onRemove: (id: string) => void;
  onSetAvatar: (id: string) => void;
}

export const LocationMediaEditor = ({
  media,
  isUploading = false,
  uploadLabel,
  emptyLabel = "Chua tai len tep da phuong tien nao",
  inputId,
  accept = "image/*,video/*",
  multiple = true,
  onUpload,
  onRemove,
  onSetAvatar,
}: LocationMediaEditorProps) => {
  const [previewMedia, setPreviewMedia] =
    useState<EditableLocationMediaItem | null>(null);

  const handleMenuClick =
    (item: EditableLocationMediaItem): MenuProps["onClick"] =>
    ({ domEvent, key }) => {
      domEvent.stopPropagation();

      if (key === "preview") {
        setPreviewMedia(item);
        return;
      }

      if (key === "avatar") {
        onSetAvatar(item.id);
        return;
      }

      if (key === "remove") {
        onRemove(item.id);
      }
    };

  const getMenuItems = (
    item: EditableLocationMediaItem,
  ): MenuProps["items"] => [
    {
      key: "preview",
      label: "Xem truoc",
    },
    {
      key: "avatar",
      label: item.isLogo ? "Dang la avatar" : "Dat lam avatar",
      disabled: item.isLogo,
    },
    {
      key: "remove",
      label: "Xoa",
      danger: true,
    },
  ];

  return (
    <>
      <div className="location-media-editor">
        {media.length === 0 ? (
          <p className="location-media-editor__empty">{emptyLabel}</p>
        ) : (
          <div className="location-media-editor__list">
            {media.map((item) => (
              <div key={item.id} className="location-media-editor__item">
                <div
                  style={{ display: "flex", alignItems: "center", minWidth: 0 }}
                >
                  <button
                    type="button"
                    className="location-media-editor__preview"
                    onClick={() => setPreviewMedia(item)}
                    aria-label={`Xem truoc ${item.fileName || (item.type === "VIDEO" ? "video" : "hinh anh")}`}
                  >
                    {item.type === "VIDEO" ? (
                      <video preload="metadata" muted playsInline>
                        <source src={item.url} />
                      </video>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.fileName || "Location media"}
                      />
                    )}
                  </button>
                  <span
                    className="file-name"
                    style={{ paddingLeft: "4px", flex: 1, minWidth: 0 }}
                  >
                    <Text
                      ellipsis={{
                        tooltip: item.fileName || "Media khong co ten",
                      }}
                    >
                      {item.fileName || "Media khong co ten"}
                    </Text>
                  </span>
                </div>

                <div className="location-media-editor__meta">
                  <button
                    className={`avatar-tag ${item.isLogo ? "active" : ""}`}
                    onClick={() => onSetAvatar(item.id)}
                  >
                    {item.isLogo ? "Avatar" : "Media"}
                  </button>
                  <Button
                    icon={<DeleteOutlined />}
                    style={{ border: "none", color: "red" }}
                    onClick={() => onRemove(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {uploadLabel && (
          <label
            htmlFor={inputId}
            className={`renter__fillInformation-upload-btn-upload ${isUploading ? "is-uploading" : ""}`}
          >
            <input
              id={inputId}
              type="file"
              accept={accept}
              disabled={isUploading}
              multiple={multiple}
              onChange={(event) => {
                if (event.target.files?.length) {
                  onUpload(event.target.files);
                }
                event.target.value = "";
              }}
            />
            <span>{isUploading ? "Dang tai media" : uploadLabel}</span>
          </label>
        )}
      </div>

      <Modal
        open={Boolean(previewMedia)}
        footer={null}
        onCancel={() => setPreviewMedia(null)}
        width="100%"
        centered
        destroyOnClose
        className="location-media-editor__modal"
      >
        <div className="location-media-editor__viewer">
          {previewMedia?.type === "VIDEO" ? (
            <video
              controls
              autoPlay
              className="location-media-editor__viewer-media"
            >
              <source src={previewMedia.url} />
            </video>
          ) : (
            previewMedia && (
              <img
                src={previewMedia.url}
                alt={previewMedia.fileName || "Location media preview"}
                className="location-media-editor__viewer-media"
              />
            )
          )}
        </div>
      </Modal>
    </>
  );
};
