import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  type LoginRequiredModalOptions,
  useLoginRequiredModal,
} from "../../providers/loginRequiredModalProvider";
import { ROUTER_PATH } from "../../routers/Route";

interface RequireLoginActionOptions extends LoginRequiredModalOptions {
  shouldNavigateToSignIn?: boolean;
  signInState?: Record<string, unknown>;
}

const getSafeRedirectPath = (redirectPath: unknown) => {
  if (typeof redirectPath !== "string" || !redirectPath) {
    return undefined;
  }

  if (!redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
    return undefined;
  }

  if (redirectPath === ROUTER_PATH.LOGIN) {
    return undefined;
  }

  return redirectPath;
};

export const useRequireLoginAction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { openLoginRequiredModal } = useLoginRequiredModal();

  const requireLoginAction = useCallback(
    (action: () => void, options?: RequireLoginActionOptions) => {
      if (isAuthenticated) {
        action();
        return true;
      }

      const currentPathAtOpen = `${location.pathname}${location.search}${location.hash}`;

      openLoginRequiredModal({
        ...options,
        onConfirm: () => {
          const providedRedirectPath = getSafeRedirectPath(
            options?.signInState?.from,
          );
          const fallbackRedirectPath = getSafeRedirectPath(currentPathAtOpen);
          const mergedSignInState: Record<string, unknown> = {
            ...(options?.signInState ?? {}),
            from: providedRedirectPath ?? fallbackRedirectPath,
          };

          options?.onConfirm?.();
          if (options?.shouldNavigateToSignIn === false) {
            return;
          }

          navigate(ROUTER_PATH.LOGIN, { state: mergedSignInState });
        },
        onCancel: () => {
          options?.onCancel?.();
        },
      });

      return false;
    },
    [
      isAuthenticated,
      location.hash,
      location.pathname,
      location.search,
      navigate,
      openLoginRequiredModal,
    ],
  );

  return { requireLoginAction, isAuthenticated };
};
