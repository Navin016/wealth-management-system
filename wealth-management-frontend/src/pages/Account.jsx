import { useState } from "react";
import Profile from "./Profile";
import Settings from "./Settings";
import "./Account.css";

function Account() {
  const [activeTab, setActiveTab] =
    useState("profile");

  return (
    <div className="account-page">

      <h1>👤 Account</h1>

      {/* -------- Tabs -------- */}
      <div className="account-tabs">

        <button
          className={
            activeTab === "profile"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("profile")
          }
        >
          Profile
        </button>

        <button
          className={
            activeTab === "settings"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("settings")
          }
        >
          Settings
        </button>

      </div>

      {/* -------- Content -------- */}
      <div className="account-content">

        {activeTab === "profile" && (
          <Profile />
        )}

        {activeTab === "settings" && (
          <Settings />
        )}

      </div>
    </div>
  );
}

export default Account;
