import Page from "../components/Page";

export default function HowPage() {
  return (
    <Page title="How It Works">
      <div className="text-blob">
        <p>
          MAXIF indentifies files through two methods. Checking the{" "}
          <a
            href="https://en.wikipedia.org/wiki/File_format#Magic_number"
            rel="noopen nofollow"
          >
            File Signature
          </a>{" "}
          and reading the file's metadata.
        </p>
        <h3>File Signature</h3>
        <p>
          Almost all files have data within their structure that can be used to
          identify them.
        </p>
        <p>Reading this data is often more than enough to identify a file.</p>
        <p>
          MAXIF reads the binary data from your files and compares it to a list
          of known file signatures.
        </p>
      </div>
    </Page>
  );
}
