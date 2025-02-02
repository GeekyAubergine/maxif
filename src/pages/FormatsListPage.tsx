import FileFormatsList from "../components/FileFormatsList";
import Page from "../components/Page";

export default function FormatsListPage() {
  return (
    <Page title="Formats" wide>
      <p className="mx-auto mt-4 my-16 text-center">File Formats supported by MAXIF</p>
      <FileFormatsList />
    </Page>
  );
}
