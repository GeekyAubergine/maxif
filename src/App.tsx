import { useCallback, useState } from "react";
import HexDisplay from "./components/HexDisplay";
import FileUploadAndDetails from "./components/FileUploadAndDetails";
import { ParsingResult } from "./parser/Parser";
import { parseFile } from "./parser/Parsers";
import { FileDataReader } from "./files/FileDataReader";

function App() {
  const [displayBuffer, setDisplayBuffer] = useState<Uint8Array>(
    Uint8Array.from([]),
  );

  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(
    null,
  );

  const onDrop = useCallback((files: File[]) => {
    console.log(files);
    if (files.length > 0) {
      const file = files[0];

      const fileReader = new FileReader();

      fileReader.onload = () => {
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

        setDisplayBuffer(new Uint8Array(fileReader.result.slice(0, 128)));

        const fileDataReader = new FileDataReader(file, fileReader.result);

        const parseResult = parseFile(fileDataReader);

        setParsingResult(parseResult);
      };

      fileReader.readAsArrayBuffer(file);
    }
  }, []);

  return (
    <>
      <div className="intro-and-file-upload">
        <div className="intro">
          <p>What type of file is that?</p>
          <p>Ever had a user upload a file your software doesn't recognise?</p>
          <p>Ever had to manually inspect a file to figure out what it is?</p>
          <p>Well fret no more!</p>
          <p>
            MAXIF is a simple tool that helps you identify the type of file you
            are looking at
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FileUploadAndDetails onDrop={onDrop} parsingResult={parsingResult} />
        <HexDisplay buffer={displayBuffer} parsingResult={parsingResult} />
        <div />
      </div>
    </>
  );
}

export default App;
