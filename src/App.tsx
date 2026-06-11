import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout";
import RouteGuard from "./components/route-guard";
import Dashboard from "./pages/dashboard";
import HabitTracker from "./pages/habit-tracker";
import InfluencerReferrals from "./pages/influencer-referrals";
import Login from "./pages/login";
import QailoManagement from "./pages/qailo-management";
import Statistics from "./pages/statistics";
import Subscriptions from "./pages/subscriptions";
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
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="influencer-referrals" element={<InfluencerReferrals />} />
        <Route path="qailo-management" element={<QailoManagement />} />
      </Route>
    </Routes>
  );
};

export default App;
