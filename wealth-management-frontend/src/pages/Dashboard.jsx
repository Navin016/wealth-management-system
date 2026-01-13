import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Wealth Dashboard
            </h1>
            <p className="text-slate-500">
              Track your goals, portfolio & growth
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* User Overview */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Welcome, {user?.name}
            </h2>
            <p className="text-slate-600 text-sm">
              {user?.email}
            </p>
          </div>

          <div className="flex gap-6">
            <InfoBadge label="Risk Profile" value={user?.risk_profile} />
            <InfoBadge label="KYC Status" value={user?.kyc_status} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Active Goals" value="3" />
          <StatCard title="Portfolio Value" value="₹1,25,000" />
          <StatCard title="Monthly Investment" value="₹15,000" />
          <StatCard title="Total Returns" value="+12.4%" positive />
        </div>

        {/* Goals & Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Goals */}
          <Card title="Your Goals">
            <GoalItem
              name="Retirement"
              progress={65}
              target="₹50,00,000"
            />
            <GoalItem
              name="Home Purchase"
              progress={40}
              target="₹30,00,000"
            />
            <GoalItem
              name="Education"
              progress={25}
              target="₹15,00,000"
            />
          </Card>

          {/* Portfolio */}
          <Card title="Portfolio Snapshot">
            <PortfolioRow asset="Equity" value="₹70,000" />
            <PortfolioRow asset="Mutual Funds" value="₹40,000" />
            <PortfolioRow asset="Cash" value="₹15,000" />
          </Card>

        </div>

        {/* Recommendations */}
      
        <Card title="Personalized Recommendations" className="recommendation-box">
          <p >
            Based on your <span className="font-medium">moderate</span> risk
            profile, consider increasing equity exposure by 5% and rebalancing
            your mutual funds.
          </p>
        </Card>

      </div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const StatCard = ({ title, value, positive }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-slate-500 text-sm">{title}</p>
    <h3
      className={`text-2xl font-bold mt-2 ${
        positive ? "text-green-600" : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-6 space-y-4">
    <h3 className="text-lg font-semibold text-slate-800">
      {title}
    </h3>
    {children}
  </div>
);

const InfoBadge = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-semibold capitalize text-slate-800">
      {value}
    </p>
  </div>
);

const GoalItem = ({ name, progress, target }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-slate-700">{name}</span>
      <span className="text-slate-500">{target}</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className="bg-indigo-500 h-2 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-slate-500 mt-1">
      {progress}% achieved
    </p>
  </div>
);

const PortfolioRow = ({ asset, value }) => (
  <div className="flex justify-between text-slate-700">
    <span>{asset}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Dashboard;
