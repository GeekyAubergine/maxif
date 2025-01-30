import { useCallback, useState } from "react";
import HexDisplay from "../components/HexDisplay";
import FileUploadAndDetails from "../components/FileUploadAndDetails";
import { Parser, PARSERS, ParsingResult } from "../parser/Parser";
import { DataViewWithCursor } from "../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../files/FileSignature";
import FileDataDisplay from "../components/FileDataDisplay";
import Page from "../components/Page";

function onFileLoad(
  file: File,
  fileReader: FileReader,
  setFile: (file: File) => void,
  setDisplayBuffer: (displayBuffer: Uint8Array) => void,
  setFileSignatureResult: (match: FileSignatureMatchResult) => void,
  setParsingResult: (parsingResult: ParsingResult | null) => void,
) {
  if (fileReader.result == null) {
    // TODO error
    alert("File read was null");
    return;
  }

  if (typeof fileReader.result === "string") {
    // TODO error
    alert("File read was a string");
    return;
  }

  setFile(file);

  setDisplayBuffer(new Uint8Array(fileReader.result.slice(0, 128)));

  const fileSignatureResult = FileSignature.findSignature(fileReader.result);

  setFileSignatureResult(fileSignatureResult);

  try {
    // @ts-expect-error - Fathom is a global variable
    fathom.trackEvent("file.processed");
  } catch (_e) {
    // Do nothing
  }

  if (fileSignatureResult === false) {
    return;
  }

  const parser: Parser | null = PARSERS[fileSignatureResult.name];

  if (parser) {
    const fileDataReader = new DataViewWithCursor(
      new DataView(fileReader.result),
    );

    const parseResult = parser.parse(fileDataReader);
    setParsingResult(parseResult);
  }
}

function FileInspectionPage() {
  const [displayBuffer, setDisplayBuffer] = useState<Uint8Array>(
    Uint8Array.from([]),
  );

  const [file, setFile] = useState<File | null>(null);

  const [fileSignatureMatchResult, setFileSignatureMatchResult] =
    useState<FileSignatureMatchResult>(false);

  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(
    null,
  );

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      const fileReader = new FileReader();

      fileReader.onload = () => {
        onFileLoad(
          file,
          fileReader,
          setFile,
          setDisplayBuffer,
          setFileSignatureMatchResult,
          setParsingResult,
        );
      };

      fileReader.readAsArrayBuffer(file);
    }
  }, []);

  return (
    <Page title="File Inspector">
      <p className="text-center mt-2 mb-16">
        Upload a file to inspect its contents and metadata
      </p>
      <div className="data-container">
        <FileUploadAndDetails onDrop={onDrop} />
        <FileDataDisplay
          file={file}
          fileSignatureMatchResult={fileSignatureMatchResult}
          parsingResult={parsingResult}
        />
        <HexDisplay
          buffer={displayBuffer}
          fileSignatureMatchResult={fileSignatureMatchResult}
        />
      </div>
    </Page>
  );
}

export default FileInspectionPage;
