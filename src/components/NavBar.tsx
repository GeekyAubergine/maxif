export default function NavBar() {
  return (
    <div className="nav-bar-wrapper">
      <nav>
        <div>
          <a href="/">
            <p className="text-2xl font-bold">MAXIF</p>
          </a>
        </div>
        <div className="link-list">
          <a href="/faq">
            <p>FAQ</p>
          </a>
        </div>
      </nav>
    </div>
  );
}
