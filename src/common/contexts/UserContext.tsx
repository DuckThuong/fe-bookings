import { getProfile } from "@/api/configs/user.config";
import {
  AUTH_STORAGE_CHANGED_EVENT,
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
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type UserContextUser = UserProfileResponseDto

interface UserContextType {
  user: UserContextUser;
  setUser: Dispatch<SetStateAction<UserContextUser>>;
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

  const { data } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfile,
    enabled: Boolean(token),
    retry: false,
  });

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

    setUser((currentUser) => ({
      ...currentUser,
      ...normalizeUser(data),
    }));
  }, [data]);

  useEffect(() => {
    if (!token) {
      setUser(normalizeUser());
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
