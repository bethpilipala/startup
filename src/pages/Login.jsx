import { Link } from "react-router-dom";
import strings from "../strings/en.js";

export default function Login() {
  return (
    <main>
      <div className="login-form">
        <div>
          <label htmlFor="email">{strings.login.emailLabel}</label>
          <input className="form-control" id="email" name="email" type="email" placeholder={strings.login.emailPlaceholder} autoComplete="username" />
        </div>
        <div>
          <label htmlFor="password">{strings.login.passwordLabel}</label>
          <input className="form-control" id="password" name="password" type="password" placeholder={strings.login.passwordPlaceholder} autoComplete="current-password" />
          <a className="login-forgot-password" href="#">{strings.login.forgotPasswordLink}</a>
        </div>
        <div className="login-actions">
          <Link className="btn" to="/userhome">{strings.login.submitButton}</Link>
          <Link className="btn" to="/userhome">{strings.login.createAccountButton}</Link>
        </div>
      </div>
    </main>
  );
}