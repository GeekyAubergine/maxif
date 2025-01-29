import NavBar from "./NavBar";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Page({ children, title }: Props) {
  return (
    <main>
      <NavBar />
      <h1>{title}</h1>
      <div className="width-controlled px-4">{children}</div>
    </main>
  );
}
