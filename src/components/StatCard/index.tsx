import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { IoMdTrendingDown } from "react-icons/io";
import "./style/index.css";

interface IProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
}

const StatCard = ({ title, value, icon, trend, trendValue }: IProps) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        {icon && <div className="stat-icon">{icon}</div>}
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-value-container">
        <div className="stat-value">{value}</div>
        {trend && trendValue && (
          <>
            <div className={`stat-trend ${trend}`}>
              {trend === "up" ? <FiTrendingUp /> : <IoMdTrendingDown />}
              {trendValue}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatCard;
