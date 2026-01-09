import "./Auth.css";

function Register() {
  return (
    <div className="form-container">
      <h2>Create Account</h2>

      <input type="text" placeholder="Full name" />
      <input type="email" placeholder="Email address" />
      <input type="password" placeholder="Password" />

      <button>Create Account</button>

      <p className="form-footer">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;
