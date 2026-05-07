import { useState } from "react";
import { Modal } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import "./style.scss";

interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
  className?: string;
}

const DEFAULT_VIDEO_THUMB = "/default-video-thumb.png";

export const MediaGallery = ({ media, className = "" }: MediaGalleryProps) => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!media || media.length === 0) {
    return (
      <div className={`media-gallery ${className} media-gallery--empty`}>
        <figure className="media-gallery__preview">
          <div className="media-gallery__placeholder">
            
          </div>
        </figure>
      </div>
    );
  }

  const mainMedia = media[0];
  const remainingCount = media.length - 1;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const renderMedia = (item: MediaItem) => {
    if (item.type === "video") {
      return (
        <video
          controls
          className="media-viewer__content"
          crossOrigin="anonymous"
        >
          <source src={item.url} />
          Trình duyệt không hỗ trợ video.
        </video>
      );
    }
    return (
      <img
        src={item.url}
        alt={`Media ${currentIndex + 1}`}
        className="media-viewer__content"
        crossOrigin="anonymous"
      />
    );
  };

  const getThumbSrc = (item: MediaItem) => {
    if (item.type === "video") {
      return item.thumbnail || DEFAULT_VIDEO_THUMB;
    }
    return item.url;
  };

  const currentMedia = media[currentIndex];

  return (
    <>
      <div
        className={`media-gallery ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowModal(true)}
      >
        <figure className="media-gallery__preview">
          <img
            src={getThumbSrc(mainMedia as any)}
            alt="Preview"
            crossOrigin="anonymous"
          />

          {remainingCount > 0 && (
            <div
              className={`media-gallery__overlay ${isHovered ? "visible" : ""}`}
            >
              <span className="media-gallery__count">+{remainingCount}</span>
            </div>
          )}
        </figure>
      </div>

      <Modal
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setCurrentIndex(0);
        }}
        footer={null}
        width="90vw"
        centered
        destroyOnClose
        className="media-gallery-modal"
        closeIcon={<CloseOutlined style={{ color: "#fff", fontSize: 24 }} />}
      >
        <div className="media-viewer">
          <div className="media-viewer__main">
            {currentMedia && renderMedia(currentMedia)}

            {media.length > 1 && (
              <>
                <button
                  className="media-viewer__nav media-viewer__nav--prev"
                  onClick={handlePrev}
                >
                  <LeftOutlined />
                </button>
                <button
                  className="media-viewer__nav media-viewer__nav--next"
                  onClick={handleNext}
                >
                  <RightOutlined />
                </button>
              </>
            )}

            <div className="media-viewer__counter">
              {currentIndex + 1} / {media.length}
            </div>
          </div>

          <div className="media-viewer__thumbnails">
            {media.map((item, index) => (
              <div
                key={index}
                className={`media-viewer__thumbnail ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={getThumbSrc(item)}
                  alt={`Thumbnail ${index + 1}`}
                  crossOrigin="anonymous"
                />
                {item.type === "video" && (
                  <div className="media-viewer__thumbnail-video-icon">▶</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
