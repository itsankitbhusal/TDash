import DashboardAnalytics from "@/components/DashboardAnalytics";
import UserListing from "@/components/UsersListing/index.tsx";

const Dashboard = () => {
  return (
    <main className="main-container">
      <div className="dashboard-wrapper">
        <DashboardAnalytics />
        <UserListing />
      </div>
    </main>
  );
};

export default Dashboard;
