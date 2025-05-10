import DashboardAnalytics from "@/components/DashboardAnalytics";
import UserListing from "@/components/UsersListing/index.tsx";

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <DashboardAnalytics />
      <UserListing />
    </div>
  );
};

export default Dashboard;
