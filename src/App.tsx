import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout";
import RouteGuard from "./components/route-guard";
import Dashboard from "./pages/dashboard";
import HabitTracker from "./pages/habit-tracker";
import Login from "./pages/login";
import Users from "./pages/users";

const App = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }
        />
        <Route
          path="/users"
          element={
            <RouteGuard>
              <Users />
            </RouteGuard>
          }
        />
        <Route
          path="/users/habit-tracker"
          element={
            <RouteGuard>
              <HabitTracker />
            </RouteGuard>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
