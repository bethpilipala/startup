import strings from "../../strings/en.js";

export default function Footer() {
  return (
    <footer>
      <hr />
      <span className="text-reset">{strings.common.authorName}</span>
      <br />
      <a href="https://github.com/bethpilipala/startup" aria-label={strings.common.githubLinkLabel} target="_blank">
        {strings.common.githubLinkText}
      </a>
    </footer>
  );
}