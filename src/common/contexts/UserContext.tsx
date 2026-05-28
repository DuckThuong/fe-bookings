import { getProfile } from "@/api/configs/user.config";
import {
  AUTH_STORAGE_CHANGED_EVENT,
  clearStoredAuth,
  getStoredToken,
} from "@/common/utils/authStorage";
import {
  UserRole,
  UserStatus,
  type UserProfileResponseDto,
} from "@/api/dtos/user.payload";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export interface UserContextUser extends UserProfileResponseDto {
  userAuthChecked: boolean;
}

interface UserContextType {
  user: UserContextUser;
  setUser: Dispatch<SetStateAction<UserContextUser>>;
  token: string | null;
  isAuthenticated: boolean;
  isAuthResolved: boolean;
  isUserLoading: boolean;
  refetchUser: () => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: UserContextUser = {
  id: 0,
  userCode: "",
  userName: "",
  userDob: "",
  userGender: 0,
  userPhone: "",
  userEmail: "",
  userAvatar: "",
  userRole: UserRole.USER,
  userStatus: UserStatus.ACTIVE,
  userIsEmailVerified: false,
  userAuthChecked: false,
};

const normalizeUser = (
  user?: Partial<UserContextUser> | UserProfileResponseDto,
): UserContextUser => {
  const source = user ?? {};

  return {
    ...defaultUser,
    ...source,
  };
};

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: Partial<UserContextUser>;
}) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<UserContextUser>(() =>
    normalizeUser(initialUser),
  );

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["userProfile", token],
    queryFn: getProfile,
    enabled: Boolean(token),
    retry: false,
  });

  const signOut = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser({
      ...normalizeUser(),
      userAuthChecked: true,
    });
  }, []);

  useEffect(() => {
    const syncToken = () => {
      setToken(getStoredToken());
    };

    window.addEventListener(AUTH_STORAGE_CHANGED_EVENT, syncToken);
    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener(AUTH_STORAGE_CHANGED_EVENT, syncToken);
      window.removeEventListener("storage", syncToken);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    setUser({
      ...normalizeUser(data),
      userAuthChecked: true,
    });
  }, [data]);

  useEffect(() => {
    if (!error) return;

    signOut();
  }, [error, signOut]);

  useEffect(() => {
    if (!token) {
      setUser({
        ...normalizeUser(),
        userAuthChecked: true,
      });
      return;
    }

    setUser((currentUser) => ({
      ...currentUser,
      userAuthChecked: false,
    }));
  }, [token]);

  const refetchUser = useCallback(() => {
    void refetch();
  }, [refetch]);

  const isUserLoading = Boolean(token) && isFetching;
  const isAuthResolved = !token || user.userAuthChecked;
  const isAuthenticated = Boolean(token && user.id);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      token,
      isAuthenticated,
      isAuthResolved,
      isUserLoading,
      refetchUser,
      signOut,
    }),
    [
      user,
      token,
      isAuthenticated,
      isAuthResolved,
      isUserLoading,
      refetchUser,
      signOut,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
