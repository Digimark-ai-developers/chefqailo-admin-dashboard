import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout";
import RouteGuard from "./components/route-guard";
import Dashboard from "./pages/dashboard";
import HabitTracker from "./pages/habit-tracker";
import Login from "./pages/login";
import Statistics from "./pages/statistics";
import Users from "./pages/users";

const App = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route
        element={
          <RouteGuard>
            <Layout />
          </RouteGuard>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/habit-tracker" element={<HabitTracker />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>
    </Routes>
  );
};

export default App;
