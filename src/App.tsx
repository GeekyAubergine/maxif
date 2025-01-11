import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileDataReader } from "./entities/FileDataReader";
import { findSignatureForReadableBuffer } from "./fileSignature/findFileSignature";
import { FileSignatureMatch } from "./fileSignature/FileSignature";
import HexDisplay from "./components/HexDisplay";
import FileUploadAndDetails from "./components/FileUploadAndDetails";

function App() {
  const [displayBuffer, setDisplayBuffer] = useState<Uint8Array>(
    Uint8Array.from([]),
  );

  const [signatureMatch, setSignatureMatch] =
    useState<FileSignatureMatch | null>(null);

  const onDrop = useCallback((files: File[]) => {
    console.log(files);
    if (files.length > 0) {
      const file = files[0];

      const fileReader = new FileReader();

      fileReader.onload = () => {
        const buffer = new Uint8Array(fileReader.result as ArrayBuffer);

        setDisplayBuffer(buffer.slice(0, 128));

        const fileDataReader = new FileDataReader(file, buffer);

        const matchingSignature =
          findSignatureForReadableBuffer(fileDataReader);
        if (matchingSignature) {
          setSignatureMatch(matchingSignature);
        }
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
        <FileUploadAndDetails onDrop={onDrop} signatureMatch={signatureMatch} />
        <HexDisplay buffer={displayBuffer} signatureMatch={signatureMatch} />
        <div />
      </div>
    </>
  );
}

export default App;
