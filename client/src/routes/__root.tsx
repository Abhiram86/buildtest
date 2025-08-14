import { Navbar } from "@/components/Navbar";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { UserProvider } from "@/context/User";
import TestSuiteProvider from "@/context/TestSuite";

export const Route = createRootRoute({
  component: () => (
    <>
      <UserProvider>
        <TestSuiteProvider>
          <Navbar />
          <Outlet />
        </TestSuiteProvider>
      </UserProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
