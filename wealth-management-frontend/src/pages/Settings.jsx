import "./Settings.css";

function Settings() {
  return (
    <div className="page">
      <h1>Settings</h1>

      <form>
        <label>
          Name
          <input type="text" placeholder="Your Name" />
        </label>

        <label>
          Email
          <input type="email" placeholder="Email" />
        </label>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Settings;
