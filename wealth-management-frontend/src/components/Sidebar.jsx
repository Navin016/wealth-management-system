import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../api";
import "./Sidebar.css";

function Sidebar() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => console.error("Failed to fetch user"));
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* HEADER */}
      <div className="sidebar-header">
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰
        </button>
      </div>

      {/* USER INFO */}
      <div className="sidebar-user">
        <img src="/user.png" alt="User" className="user-img" />

        {!collapsed && user && (
          <>
            <h3>{user.name}</h3>
            <div className="badges">
              <span className="badge">{user.risk_profile}</span>
              <span className="badge kyc">{user.kyc_status}</span>
            </div>
          </>
        )}
      </div>

      {/* NAV */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard">📊 {!collapsed && "Dashboard"}</NavLink>
        <NavLink to="/portfolio">💼 {!collapsed && "Portfolio"}</NavLink>
        <NavLink to="/investments">💰 {!collapsed && "Investments"}</NavLink>
        <NavLink to="/goals">🎯 {!collapsed && "Goals"}</NavLink>
        <NavLink to="/transactions">📄 {!collapsed && "Transactions"}</NavLink>
        <NavLink to="/reports">🧾 {!collapsed && "Reports"}</NavLink>
        <NavLink to="/account">⚙️ {!collapsed && "Account"}</NavLink>
      </nav>

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }}
      >
        🚪 {!collapsed && "Logout"}
      </button>
    </aside>
  );
}

export default Sidebar;
