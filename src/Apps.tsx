import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import RouterWeb from "./routers/Routers";
import { LoadingProvider } from "./providers/loadingProvider";
import { NotificationProvider } from "./providers/notificationProvider";
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
          <LoadingProvider>
            <NotificationProvider>
              <AntdApp>
                <RouterWeb />
              </AntdApp>
            </NotificationProvider>
          </LoadingProvider>
        </UserProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
