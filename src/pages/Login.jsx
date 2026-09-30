export default function Login() {
  return (
    <main>
      <form className="login-form" method="get" action="userhome.html">
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
          <button className="btn" type="submit">Log in</button>
          <button className="btn" type="submit">Create account</button>
        </div>
      </form>
    </main>
  );
}