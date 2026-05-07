import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { uploadImage } from "../../../api/configs/common.config";
import { sendChatMessage } from "../../../api/configs/chat.config";
import type {
  MessageResponseDto,
  SendMessageAttachmentDto,
} from "../../../api/dtos/chat.dto";
import emoji from "../../../assets/svg/emoji.svg";
import remove from "../../../assets/svg/remove.svg";
import send from "../../../assets/svg/send.svg";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
} from "../../../common/constants/constants";
import { useNotification } from "../../../providers/notificationProvider";

export interface ChatInputProps {
  conversationId: number;
  disabled?: boolean;
  onMessageSent?: (message: MessageResponseDto) => void;
  onComposerHeightChange?: (height: number) => void;
  droppedFilesPayload?: {
    id: number;
    files: File[];
  } | null;
}

export const ChatInput = (props: ChatInputProps) => {
  const { showNotification } = useNotification();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const composerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPositionRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const isBusy = props.disabled || isSending || isUploading;

  const openFilePicker = () => {
    if (isBusy) return;
    fileInputRef.current?.click();
  };

  const addSelectedFiles = useCallback((selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...selectedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const resolveErrorMessage = (error: unknown): string => {
    let nextMessage = DEFAULT_MESSAGE;

    if (isAxiosError(error)) {
      const apiMessage = error.response?.data?.message;

      if (typeof apiMessage === "string") {
        nextMessage = apiMessage;
      } else if (Array.isArray(apiMessage) && apiMessage[0]) {
        nextMessage = String(apiMessage[0]);
      }
    } else if (error instanceof Error && error.message) {
      nextMessage = error.message;
    }

    return nextMessage;
  };

  const getImageDimensions = async (
    file: File,
  ): Promise<{ width: number; height: number } | undefined> => {
    if (!file.type.startsWith("image/")) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);

    try {
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const image = new Image();

          image.onload = () => {
            resolve({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });
          };

          image.onerror = () => {
            reject(new Error("Cannot read image dimensions"));
          };

          image.src = objectUrl;
        },
      );

      return dimensions;
    } catch {
      return undefined;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const uploadAttachments = async (
    selectedFiles: File[],
  ): Promise<SendMessageAttachmentDto[]> => {
    return Promise.all(
      selectedFiles.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const [uploadResult, dimensions] = await Promise.all([
            uploadImage(formData),
            getImageDimensions(file),
          ]);

          return {
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            url: uploadResult.imageUrl,
            width: dimensions?.width,
            height: dimensions?.height,
          };
        } catch (error) {
          throw new Error(`Khong the tai file ${file.name}: ${resolveErrorMessage(error)}`);
        }
      }),
    );
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("click");
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    addSelectedFiles(Array.from(selectedFiles));

    e.target.value = "";
  };

  useEffect(() => {
    if (!props.droppedFilesPayload?.files?.length) {
      return;
    }

    addSelectedFiles(props.droppedFilesPayload.files);
  }, [addSelectedFiles, props.droppedFilesPayload]);

  useEffect(() => {
    if (!props.onComposerHeightChange) {
      return;
    }

    const composerElement = composerRef.current;
    if (!composerElement) {
      return;
    }

    const emitComposerHeight = () => {
      props.onComposerHeightChange?.(
        composerElement.getBoundingClientRect().height,
      );
    };

    emitComposerHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      emitComposerHeight();
    });

    observer.observe(composerElement);

    return () => {
      observer.disconnect();
    };
  }, [props.onComposerHeightChange]);

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = cursorPositionRef.current;
    const newMessage =
      message.slice(0, start) + emojiData.emoji + message.slice(start);

    setMessage(newMessage);
    setShowEmojiPicker(false);

    setTimeout(() => {
      const newPosition = start + emojiData.emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const resetComposer = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    setFiles([]);
    setPreviews([]);
    setMessage("");
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    const hasFiles = files.length > 0;

    if ((!trimmedMessage && !hasFiles) || !props.conversationId || isBusy) {
      return;
    }

    setIsSending(true);
    setIsUploading(hasFiles);

    try {
      const attachments = hasFiles ? await uploadAttachments(files) : undefined;

      const createdMessage = await sendChatMessage({
        conversationId: props.conversationId,
        content: trimmedMessage || undefined,
        attachments,
      });

      if (createdMessage) {
        props.onMessageSent?.(createdMessage);
      }

      resetComposer();
    } catch (error) {
      showNotification(resolveErrorMessage(error), NOTI_ERROR);
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };

  return (
    <div
      ref={composerRef}
      className={`chat__input ${previews.length > 0 ? "has-files" : ""}`}
    >
      <button
        type="button"
        className="chat__input-col-1"
        onClick={openFilePicker}
        disabled={isBusy}
        aria-label="Upload file"
      />
      <input
        id="upload"
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        multiple
        ref={fileInputRef}
        onChange={handleUploadImage}
        disabled={isBusy}
        style={{ display: "none" }}
      />
      <section className="chat__input-col-2" aria-label="Vùng nhập tin nhắn">
        {previews.length > 0 && (
          <figure className="image_container">
            {previews.map((preview, index) => (
              <div key={preview} className="image_container-item">
                <img
                  src={preview}
                  alt={`preview-${index}`}
                  className="image_container-item"
                />
                <button
                  type="button"
                  className="image_container-action"
                  onClick={() => removeImage(index)}
                  disabled={isBusy}
                >
                  <img src={remove} alt="" />
                </button>
              </div>
            ))}
          </figure>
        )}

        <textarea
          ref={textareaRef}
          placeholder={"Nhập tin nhắn"}
          className="chat__input-col-2-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isBusy}
          onSelect={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
          }}
          onClick={(e) => {
            cursorPositionRef.current = e.currentTarget.selectionStart;
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await sendMessage();
            }
          }}
          rows={1}
        />
      </section>
      <div className="chat__input-col-3">
        <button
          type="button"
          className="chat__input-icon-button"
          onClick={() => {
            if (isBusy) return;
            setShowEmojiPicker(!showEmojiPicker);
          }}
          disabled={isBusy}
          aria-label="Open emoji picker"
        >
          <img src={emoji} alt="" className="chat__input-emoji" />
        </button>

        <button
          type="button"
          className="chat__input-icon-button"
          onClick={() => {
            void sendMessage();
          }}
          disabled={isBusy}
          aria-label="Send message"
        >
          <img src={send} alt="" className="chat__input-send" />
        </button>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="chat__input-emoji-picker">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
              width={320}
              height={400}
            />
          </div>
        )}
      </div>
    </div>
  );
};
