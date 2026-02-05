import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.css";

const queryClient = new QueryClient();

import MainScreen from "./src/MainScreen";
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainScreen />
    </QueryClientProvider>
  );
}
