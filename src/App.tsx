import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import SubscriptionPage from "./components/SubscriptionPage";
import ChatPage from "./components/ChatPage";
import ManageSubscription from "./components/ManageSubscription";
import AccountSettings from "./components/AccountSettings";
import ResetPassword from "./components/ResetPassword";
import TestAccountsPage from "./pages/TestAccounts";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import { useLoading } from "./hooks/useLoading";

const queryClient = new QueryClient();

const App = () => {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage mode="login" />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/chat/:idolId" element={<ChatPage />} />
            <Route path="/manage-subscription" element={<ManageSubscription />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/test-accounts" element={<TestAccountsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
