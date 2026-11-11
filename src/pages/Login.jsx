import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, register } from "../services/auth.js";
import strings from "../strings/en.js";

export default function Login({ onAuthenticate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setMessage(strings.login.requiredFieldsError);
      return;
    }

    setMessage("");
    setPending(true);
    try {
      const authenticate = event.nativeEvent.submitter?.value === "register" ? register : login;
      const user = await authenticate(trimmedEmail, password);
      onAuthenticate(user);
      const destination = location.state?.from;
      navigate(destination ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}` : "/userhome", { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPending(false);
    }
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
          <button className="btn" type="submit" value="login" disabled={pending}>{strings.login.submitButton}</button>
          <button className="btn" type="submit" value="register" disabled={pending}>{strings.login.createAccountButton}</button>
        </div>
        {message && <p role="alert">{message}</p>}
      </form>
    </main>
  );
}