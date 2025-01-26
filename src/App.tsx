import { useCallback, useState } from "react";
import HexDisplay from "./components/HexDisplay";
import FileUploadAndDetails from "./components/FileUploadAndDetails";
import { Parser, PARSERS, ParsingResult } from "./parser/Parser";
import { DataViewWithCursor } from "./files/FileDataReader";
import { FileSignature, FileSignatureMatchResult } from "./files/FileSignature";
import MetadataDisplay from "./components/MetadataDisplay";

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

  const fileDataReader = new DataViewWithCursor(
    new DataView(fileReader.result),
  );

  setFileSignatureResult(fileSignatureResult);

  if (fileSignatureResult === false) {
    return;
  }

  const parser: Parser | null = PARSERS[fileSignatureResult.name];

  console.log(parser);

  if (parser) {
    const parseResult = parser.parse(fileDataReader);
    setParsingResult(parseResult);
    console.log(parseResult);
  }
}

function App() {
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
    console.log(files);
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
    <>
      <div className="intro-and-file-upload">
        <div className="intro">
          <h1>MAXIF</h1>
          <p>Files sometimes aren't what they seem</p>
          <p>MAXIF uses file signatures to verify file types</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FileUploadAndDetails
          onDrop={onDrop}
          file={file}
          fileSignatureMatchResult={fileSignatureMatchResult}
        />
        <HexDisplay
          buffer={displayBuffer}
          fileSignatureMatchResult={fileSignatureMatchResult}
        />
        <MetadataDisplay parsingResult={parsingResult} />
      </div>
    </>
  );
}

export default App;
