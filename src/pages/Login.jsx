import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import strings from "../strings/en.js";

export default function Login({ onAuthenticate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setMessage(strings.login.requiredFieldsError);
      return;
    }

    onAuthenticate(trimmedEmail);
    const destination = location.state?.from?.pathname ?? "/userhome";
    navigate(destination, { replace: true });
  };

  return (
    <main>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">{strings.login.emailLabel}</label>
          <input
            className="form-control"
            id="email"
            name="email"
            type="email"
            placeholder={strings.login.emailPlaceholder}
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">{strings.login.passwordLabel}</label>
          <input
            className="form-control"
            id="password"
            name="password"
            type="password"
            placeholder={strings.login.passwordPlaceholder}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p className="login-forgot-password">{strings.login.forgotPasswordNotice}</p>
        </div>
        <div className="login-actions">
          <button className="btn" type="submit">{strings.login.submitButton}</button>
          <button className="btn" type="submit">{strings.login.createAccountButton}</button>
        </div>
        {message && <p role="alert">{message}</p>}
        <p>{strings.login.mockAuthNotice}</p>
      </form>
    </main>
  );
}