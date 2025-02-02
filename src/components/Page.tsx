import cx from "classnames";
import Footer from "./Footer";
import NavBar from "./NavBar";

type Props = {
  children: React.ReactNode;
  title?: string;
  wide?: boolean;
};

export default function Page({ children, title, wide }: Props) {
  return (
    <main>
      <NavBar />
      <div className="flex-1">
        <h1>{title}</h1>
        <div className={cx(!wide ? "width-controlled" : "wide")}>
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
}
