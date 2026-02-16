import { useState } from "react";
import API from "../api";
import { Eye, EyeOff } from "lucide-react";
import "./Settings.css";

function Settings() {

  /* ---------------- STATES ---------------- */

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* ✅ Success UI */
  const [successState, setSuccessState] =
    useState(false);

  /* ---------------- INPUT ---------------- */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ---------------- AUTO HIDE ---------------- */

  const handleWrapperBlur = (field, e) => {
    const wrapper = e.currentTarget;

    if (wrapper.contains(e.relatedTarget))
      return;

    setShow(prev => ({
      ...prev,
      [field]: false
    }));
  };

  /* ---------------- PASSWORD MATCH ---------------- */

  const mismatch =
    form.confirm_password &&
    form.new_password !==
      form.confirm_password;

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (mismatch) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      const res = await API.put(
        "/auth/change-password",
        {
          old_password:
            form.old_password,
          new_password:
            form.new_password
        }
      );

      /* ✅ SUCCESS */
      setMessage(
        res.data.message ||
        "Password changed successfully ✅"
      );

      setSuccessState(true);

      /* Reset form */
      setForm({
        old_password: "",
        new_password: "",
        confirm_password: ""
      });

      /* Auto reset UI */
      setTimeout(() => {
        setSuccessState(false);
        setMessage("");
      }, 2500);

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Failed to change password"
      );
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`settings-wrapper ${
        successState
          ? "success-glow"
          : ""
      }`}
    >

      <div className="settings-card">

        <h2>Change Password</h2>

        {/* SUCCESS */}
        {message && (
          <div className="success-banner">
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* OLD PASSWORD */}
          <div
            className="input-group"
            onBlur={(e) =>
              handleWrapperBlur(
                "old",
                e
              )
            }
          >
            <input
              type={
                show.old
                  ? "text"
                  : "password"
              }
              name="old_password"
              placeholder="Old Password"
              value={form.old_password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShow(prev => ({
                  ...prev,
                  old: !prev.old
                }))
              }
            >
              {show.old
                ? <EyeOff size={18}/>
                : <Eye size={18}/>}
            </button>
          </div>

          {/* NEW PASSWORD */}
          <div
            className="input-group"
            onBlur={(e) =>
              handleWrapperBlur(
                "new",
                e
              )
            }
          >
            <input
              type={
                show.new
                  ? "text"
                  : "password"
              }
              name="new_password"
              placeholder="New Password"
              value={form.new_password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShow(prev => ({
                  ...prev,
                  new: !prev.new
                }))
              }
            >
              {show.new
                ? <EyeOff size={18}/>
                : <Eye size={18}/>}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div
            className="input-group"
            onBlur={(e) =>
              handleWrapperBlur(
                "confirm",
                e
              )
            }
          >
            <input
              type={
                show.confirm
                  ? "text"
                  : "password"
              }
              name="confirm_password"
              placeholder="Confirm Password"
              value={
                form.confirm_password
              }
              onChange={handleChange}
              className={
                mismatch
                  ? "mismatch"
                  : ""
              }
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShow(prev => ({
                  ...prev,
                  confirm:
                    !prev.confirm
                }))
              }
            >
              {show.confirm
                ? <EyeOff size={18}/>
                : <Eye size={18}/>}
            </button>
          </div>

          {mismatch && (
            <div className="mismatch-text">
              New and Confirm password
              should match
            </div>
          )}

          <button
            type="submit"
            className={`change-btn ${
              successState
                ? "success"
                : ""
            }`}
          >
            Change Password
          </button>

        </form>

      </div>
    </div>
  );
}

export default Settings;
