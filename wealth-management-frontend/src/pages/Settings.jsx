function Settings() {
  return (
    <div className="settings-section">

      <h2>Account Settings</h2>

      <div className="settings-card">

        <button>
          Change Password
        </button>

        <button>
          Enable 2FA
        </button>

        <button>
          Notification Preferences
        </button>

        <button>
          Logout
        </button>

      </div>

    </div>
  );
}

export default Settings;
