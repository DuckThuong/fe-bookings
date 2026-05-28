import { Modal } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface LoginRequiredModalOptions {
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface LoginRequiredModalContextType {
  openLoginRequiredModal: (options?: LoginRequiredModalOptions) => void;
  closeLoginRequiredModal: () => void;
}

const LoginRequiredModalContext = createContext<
  LoginRequiredModalContextType | undefined
>(undefined);

export const LoginRequiredModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [options, setOptions] = useState<LoginRequiredModalOptions | null>(
    null,
  );

  const closeLoginRequiredModal = useCallback(() => {
    setOptions(null);
  }, []);

  const openLoginRequiredModal = useCallback(
    (nextOptions?: LoginRequiredModalOptions) => {
      setOptions(nextOptions ?? {});
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    const currentOptions = options;
    closeLoginRequiredModal();
    currentOptions?.onConfirm?.();
  }, [closeLoginRequiredModal, options]);

  const handleCancel = useCallback(() => {
    const currentOptions = options;
    closeLoginRequiredModal();
    currentOptions?.onCancel?.();
  }, [closeLoginRequiredModal, options]);

  const contextValue = useMemo(
    () => ({
      openLoginRequiredModal,
      closeLoginRequiredModal,
    }),
    [closeLoginRequiredModal, openLoginRequiredModal],
  );

  return (
    <LoginRequiredModalContext.Provider value={contextValue}>
      {children}
      <Modal
        centered
        open={Boolean(options)}
        title={options?.title ?? "Cần đăng nhập"}
        okText={options?.confirmText ?? "Đăng nhập"}
        cancelText={options?.cancelText ?? "Hủy"}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        {options?.content ?? (
          <p>Bạn cần đăng nhập để tiếp tục sử dụng chức năng này.</p>
        )}
      </Modal>
    </LoginRequiredModalContext.Provider>
  );
};

export const useLoginRequiredModal = () => {
  const context = useContext(LoginRequiredModalContext);

  if (!context) {
    throw new Error(
      "useLoginRequiredModal must be used within LoginRequiredModalProvider",
    );
  }

  return context;
};
