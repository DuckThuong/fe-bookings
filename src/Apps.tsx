import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import RouterWeb from "./routers/Routers";
import { LoadingProvider } from "./providers/loadingProvider";
import { NotificationProvider } from "./providers/notificationProvider";
import { SocketProvider } from "./providers/SocketProvider";
import { UserProvider } from "./common/contexts/UserContext";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Open Sans",
          },
        }}
      >
        <UserProvider>
          <SocketProvider>
            <LoadingProvider>
              <NotificationProvider>
                <AntdApp>
                  <RouterWeb />
                </AntdApp>
              </NotificationProvider>
            </LoadingProvider>
          </SocketProvider>
        </UserProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
