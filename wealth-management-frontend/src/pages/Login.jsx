// import "./Auth.css";

// function Login() {
//   return (
//     <div className="form-container">
//       <h2>Login</h2>

//       <input type="email" placeholder="Email address" />
//       <input type="password" placeholder="Password" />

//       <button>Login</button>

//       <p className="form-footer">
//         Don’t have an account? <a href="/register">Register</a>
//       </p>
//     </div>
//   );
// 
// }

// export default Login;
import "./Auth.css";

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault(); // ⛔ stop page reload
    console.log("Login clicked");
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input type="email" placeholder="Email address" required />
      <input type="password" placeholder="Password" required />

      <button type="submit">Login</button>

      <p className="form-footer">
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </form>
  );
}

export default Login;


