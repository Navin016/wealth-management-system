import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { Eye, EyeOff } from "lucide-react";
import "./Auth.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await API.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem(
        "access_token",
        res.data.access_token
      );

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Login failed"
      );
    }
  };

  return (
    <div className="auth-wrapper">

      <div className="auth-card">

        <h2>Login</h2>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="floating-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
            <label>Email Address</label>
          </div>

          {/* PASSWORD */}
          <div className="floating-group password-group">

            <input
              type={
                show ? "text" : "password"
              }
              placeholder=" "
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <label>Password</label>

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShow(!show)
              }
            >
              {show
                ? <EyeOff size={18}/>
                : <Eye size={18}/>}
            </button>

          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
