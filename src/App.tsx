import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileDataReader } from "./entities/FileDataReader";
import { findSignatureForReadableBuffer } from "./fileSignature/findFileSignature";
import { FileSignatureMatch } from "./fileSignature/FileSignature";
import HexDisplay from "./components/HexDisplay";

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <>
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
      <div className="file-data">
        <div {...getRootProps()} className="input-wrapper">
          <input {...getInputProps()} />
          <p>Upload File</p>
        </div>
        <div className="file-type">
          <h3>File Data</h3>

          <h4>File Type</h4>
          {signatureMatch ? (
            <p>{signatureMatch.fileSignature.format}</p>
          ) : (
            <p>Unknown</p>
          )}
        </div>
      </div>
      <div className="hex-and-metadata">
        <HexDisplay buffer={displayBuffer} signatureMatch={signatureMatch} />
      </div>
    </>
  );
}

export default App;
