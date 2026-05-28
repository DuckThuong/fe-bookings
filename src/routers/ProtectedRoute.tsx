import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../common/contexts/UserContext";
import { useLoginRequiredModal } from "../providers/loginRequiredModalProvider";
import { useLoading } from "../providers/loadingProvider";
import { ROUTER_PATH } from "./Route";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { isAuthenticated, isUserLoading, isAuthResolved } = useUser();
  const { openLoginRequiredModal } = useLoginRequiredModal();
  const openedForPathRef = useRef<string | null>(null);
  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    setLoading(isUserLoading || !isAuthResolved);

    return () => {
      setLoading(false);
    };
  }, [isUserLoading, isAuthResolved, setLoading]);

  useEffect(() => {
    if (!isAuthResolved || isUserLoading || isAuthenticated) {
      if (isAuthenticated) {
        openedForPathRef.current = null;
      }
      return;
    }

    if (openedForPathRef.current === currentPath) {
      return;
    }

    openedForPathRef.current = currentPath;
    openLoginRequiredModal({
      title: "Cần đăng nhập",
      content: "Bạn cần đăng nhập để tiếp tục truy cập trang này.",
      confirmText: "Đăng nhập",
      cancelText: "Về trang chủ",
      onConfirm: () => {
        navigate(ROUTER_PATH.LOGIN, {
          state: { from: currentPath },
        });
      },
      onCancel: () => {
        navigate(ROUTER_PATH.HOME, { replace: true });
      },
    });
  }, [
    currentPath,
    isAuthenticated,
    isAuthResolved,
    isUserLoading,
    navigate,
    openLoginRequiredModal,
  ]);

  if (isUserLoading || !isAuthResolved || !isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
