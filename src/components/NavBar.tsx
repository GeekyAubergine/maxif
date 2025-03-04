export default function NavBar() {
  return (
    <div className="nav-wrapper">
      <nav>
        <div>
          <p className="text-xl font-bold">
            <a href="/">MAXIF</a>
          </p>
        </div>
        <div className="link-list">
          <p>
            <a href="/formats">Formats</a>
          </p>
          <p>
            <a href="/faq">FAQ</a>
          </p>
        </div>
      </nav>
    </div>
  );
}
