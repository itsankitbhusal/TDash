import { useEffect, useState } from "react";
import { loadUsers, loadSubscriptions } from "@/utils/loadDataLists";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ISub, IUser } from "@/types";
import StatCard from "@/components/StatCard";
import { FiUsers } from "react-icons/fi";

interface PackageData {
  name: string;
  count: number;
}

const DashboardAnalytics = () => {
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [subsData, setSubsData] = useState<ISub[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [usersResult, subsResult] = await Promise.allSettled([
        loadUsers(),
        loadSubscriptions(),
      ]);

      if (usersResult.status === "fulfilled") {
        setUsersData(usersResult.value as IUser[]);
      }
      if (subsResult.status === "fulfilled") {
        setSubsData(subsResult.value as ISub[]);
      }
    };
    fetchData();
  }, []);

  const totalUsers = usersData.length;
  const activeUsers = usersData.filter((u) => u.active === "1").length;
  const inactiveUsers = totalUsers - activeUsers;

  const today = new Date();

  const expiredSubs = subsData.filter(
    (s) => new Date(s.expires_on) < today
  ).length;

  const topData: Record<string, number> = {};

  subsData?.forEach((sub) => {
    const packageName = sub.package;
    topData[packageName] = (topData[packageName] || 0) + 1;
  });

  const topPackages: PackageData[] = Object.entries(topData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="dashboard-container">
      <h1>Subscription Dashboard</h1>

      <div className="stat-grid">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<FiUsers />}
          trend="up"
          trendValue={`${activeUsers} Active`}
        />
        <StatCard
          title="Total Subscriptions"
          value={subsData.length}
          icon={<FiUsers />}
          trend="down"
          trendValue={`${expiredSubs} Expired`}
        />
        <StatCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={<FiUsers />}
          trend="down"
          trendValue={`${inactiveUsers} Inactive`}
        />
      </div>

      <div className="chart-wrapper">
        <h3>Top Subscribed Packages</h3>
        <div className="chart">
          <ResponsiveContainer width={"100%"} height={300}>
            <BarChart data={topPackages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--primary-blue)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
