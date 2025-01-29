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
          <a href="/why">
            <p>Why use this</p>
          </a>
          <a href="/how">
            <p>How it works</p>
          </a>
          {/* <a href="/who">
            <p>Who made this</p>
          </a> */}
        </div>
      </nav>
    </div>
  );
}
