import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../api";
import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  /* Eye visibility */
  const [show, setShow] = useState({
    password: false,
    confirm: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (wrapper.contains(e.relatedTarget)) return;

    setShow(prev => ({
      ...prev,
      [field]: false
    }));
  };

  /* ---------------- PASSWORD MATCH ---------------- */

  const mismatch =
    form.confirm_password &&
    form.password !== form.confirm_password;

  /* ---------------- SUBMIT ---------------- */

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (mismatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(
        "/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password
        }
      );

      localStorage.setItem(
        "access_token",
        res.data.access_token
      );

      navigate("/dashboard");

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="auth-wrapper">

      <form
        className="auth-card"
        onSubmit={handleRegister}
      >

        <h2>Create Account</h2>

        {/* ERROR */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* NAME */}
        <div className="floating-group">
          <input
            type="text"
            name="name"
            placeholder=" "
            value={form.name}
            onChange={handleChange}
            required
          />
          <label>Full Name</label>
        </div>

        {/* EMAIL */}
        <div className="floating-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={form.email}
            onChange={handleChange}
            required
          />
          <label>Email Address</label>
        </div>

        {/* PASSWORD */}
        <div
          className="floating-group password-group"
          onBlur={(e) =>
            handleWrapperBlur("password", e)
          }
        >
          <input
            type={
              show.password
                ? "text"
                : "password"
            }
            name="password"
            placeholder=" "
            value={form.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>

          <button
            type="button"
            className="eye-btn"
            onClick={() =>
              setShow(prev => ({
                ...prev,
                password:
                  !prev.password
              }))
            }
          >
            {show.password
              ? <EyeOff size={18}/>
              : <Eye size={18}/>}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <div
          className="floating-group password-group"
          onBlur={(e) =>
            handleWrapperBlur("confirm", e)
          }
        >
          <input
            type={
              show.confirm
                ? "text"
                : "password"
            }
            name="confirm_password"
            placeholder=" "
            value={form.confirm_password}
            onChange={handleChange}
            className={
              mismatch
                ? "mismatch"
                : ""
            }
            required
          />
          <label>Confirm Password</label>

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

        {/* MISMATCH TEXT */}
        {mismatch && (
          <div className="mismatch-text">
            Passwords must match
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

        {/* FOOTER */}
        <p className="auth-footer">
          Already have an account?{" "}
          <span
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}

export default Register;
