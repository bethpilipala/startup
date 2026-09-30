import { Link } from "react-router-dom";

export default function Login() {
  return (
    <main>
      <div className="login-form">
        <div>
          <label htmlFor="email">Email</label>
          <input className="form-control" id="email" name="email" type="email" placeholder="your@email.com" autoComplete="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input className="form-control" id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          <a className="login-forgot-password" href="#">Forgot your password?</a>
        </div>
        <div className="login-actions">
          <Link className="btn" to="/userhome">Log in</Link>
          <Link className="btn" to="/userhome">Create account</Link>
        </div>
      </div>
    </main>
  );
}