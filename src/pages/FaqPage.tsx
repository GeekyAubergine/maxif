import Page from "../components/Page";

export default function FaqPage() {
  return (
    <Page title="FAQ">
      <div className="text-blob">
        <h3 id="security">Security</h3>
        <p>
          Security is important. Don&#39;t upload your files to services you
          don&#39;t trust.
        </p>
        <p>
          Your files never leave your browser. All computation is done in your
          browser. No data about your file is stored anywhere at any time.
        </p>
        <p>
          You can confirm this by opening the developer tools in your browser,
          going to the network section and uploading a test file. You will see
          no transfer of any private data to any service.
        </p>
        <p>
          MAXIF does some basic usage tracking to determine page views and usage
          statistics. This data is anonymous and does not use or create cookies.
        </p>
        <h3 id="who-is-this-for-">Who is this for?</h3>
        <p>
          This project resulted from years of having customers upload files to
          the various services I&#39;ve worked on that claim to be JPEG or PNG
          files that don&#39;t work. After inspection, the files almost always
          turned out to be in a different format and had been renamed. I built
          this rather than having to read the bytes by hand and compare them to
          file signatures.
        </p>
        <p>
          MAXIF is for anyone who has experienced problems like this or wants to
          verify the type of file they have been given.
        </p>
        <h3 id="how-does-it-work-">How does it work?</h3>
        <p>
          MAXIF identifies files by checking the{" "}
          <a
            href="https://en.wikipedia.org/wiki/File_format#Magic_number"
            rel="noopener noreferrer"
          >
            File Signature
          </a>{" "}
          and reading the file&#39;s metadata.
        </p>
        <h4 id="file-signature">File Signature</h4>
        <p>
          Almost all files have data within their structure that can be used to
          identify them.
        </p>
        <p>Reading this data is often more than enough to identify a file.</p>
        <p>
          MAXIF has an extensive list of file signatures that it compares
          against when you upload a file. It will find the best fit and show the
          details.
        </p>
        <h4 id="metadata-exif">Metadata / Exif</h4>
        <p>
          Sometimes, the file signature is not enough, so MAXIF attempts to read
          the data inside the file to glean more information about it.
        </p>
        <p>
          In addition, reading this data allows MAXIF to display additional
          details about the file in one place.
        </p>
        <h4 id="metadata-issue">I've got an issue</h4>
        <p>
          If you find a file that's not being identified correctly, or you have
          a file that MAXIF can't read. Please contact me on{" "}
          <a
            href="https://social.lol/@geekyaubergine"
            rel="noopener noreferrer"
          >
            Mastodon
          </a>{" "}
          or open an issue on{" "}
          <a
            href="https://github.com/GeekyAubergine/maxif/issues"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
        <h3 id="why-maxif-">Why MAXIF?</h3>
        <p>
          My friend{" "}
          <a href="https://nexer.net/" rel="noopener noreferrer">
            Doug
          </a>{" "}
          suggested the name. It stands for Magic number And eXif Information
          Finder.
        </p>
        <h3 id="can-i-verify-this-">Can I verify this?</h3>
        <p>
          Yes, MAXIF is open source and available on{" "}
          <a
            href="https://github.com/geekyaubergine/maxif"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </Page>
  );
}
