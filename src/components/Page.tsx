import Footer from "./Footer";
import NavBar from "./NavBar";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Page({ children, title }: Props) {
  return (
    <main>
      <NavBar />
      <div className="flex-1">
        <h1>{title}</h1>
        <div className="width-controlled px-4">{children}</div>
      </div>
      <Footer />
    </main>
  );
}
