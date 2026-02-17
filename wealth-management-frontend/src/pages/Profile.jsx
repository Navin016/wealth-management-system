import { useEffect, useState } from "react";
import API from "../api";
import "./Profile.css";

function Profile() {

  /* ================= STATES ================= */

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    gender: "",
    profession: "",
    age: "",
    salary: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* Success UI state */
  const [successState, setSuccessState] =
    useState(false);

  /* ✅ Risk state */
  const [risk, setRisk] = useState(null);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/auth/me");

        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          gender: res.data.gender || "",
          profession:
            res.data.profession || "",
          age: res.data.age || "",
          salary: res.data.salary || ""
        });

        /* ===== FETCH RISK PROFILE ===== */
        const riskRes = await API.get(
          "/auth/risk-profile"
        );

        setRisk(riskRes.data);

      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= UPDATE PROFILE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await API.put(
        "/auth/update-profile",
        form
      );

      setMessage(
        "Profile updated successfully ✅"
      );

      /* Trigger glow + green button */
      setSuccessState(true);

      /* Auto reset UI + banner */
      setTimeout(() => {
        setSuccessState(false);
        setMessage("");
      }, 2500);

    } catch {
      setError("Update failed");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return <div>Loading profile...</div>;
  }

  /* ================= UI ================= */

  return (
    <div
      className={`profile-section ${
        successState
          ? "success-glow"
          : ""
      }`}
    >

      <h2>Edit Profile</h2>

      {/* ===== RISK PROFILE BANNER ===== */}

      {risk && (
        <div className="profile-risk-banner">

          <div className="profile-risk-left">

            <p className="profile-risk-title">
              Risk Profile
            </p>

            <h3
              className={`profile-risk-label ${
                risk.risk_profile
              }`}
            >
              {risk.risk_profile.toUpperCase()}
            </h3>

          </div>

          <div className="profile-risk-right">

            <div className="profile-risk-score">
              {risk.risk_score}
              <span>/100</span>
            </div>

            <div className="profile-risk-meter">
              <div
                className="profile-risk-fill"
                style={{
                  width: `${risk.risk_score}%`
                }}
              />
            </div>

          </div>

        </div>
      )}

      {message && (
        <div className="success">
          {message}
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">

          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className="form-group">
            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="male">
                Male
              </option>
              <option value="female">
                Female
              </option>
              <option value="other">
                Other
              </option>
            </select>
          </div>

          {/* Profession */}
          <div className="form-group">
            <label>Profession</label>
            <input
              name="profession"
              value={form.profession}
              onChange={handleChange}
            />
          </div>

          {/* Age */}
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          {/* Salary */}
          <div className="form-group">
            <label>Salary (₹)</label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Save Button */}
        <button
          type="submit"
          className={`save-btn ${
            successState
              ? "success"
              : ""
          }`}
        >
          Save Changes
        </button>

      </form>
    </div>
  );
}

export default Profile;
