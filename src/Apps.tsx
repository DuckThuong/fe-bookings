import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import RouterWeb from "./routers/Routers";
import { LoadingProvider } from "./providers/loadingProvider";
import { NotificationProvider } from "./providers/notificationProvider";

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
        <LoadingProvider>
          <NotificationProvider>
            <AntdApp>
              <RouterWeb />
            </AntdApp>
          </NotificationProvider>
        </LoadingProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
