import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="app-name shine-text">
          Wealth Management & Goal Tracking
        </h2>
        <img src="/logo.png" alt="Logo" className="logo sparkle-logo" />
      </div>

      <div className="navbar-right">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>

       

        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>

        <NavLink to="/register" className="nav-link register-btn">
          Register
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
