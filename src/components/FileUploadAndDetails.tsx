import { useDropzone } from "react-dropzone";
import cx from "classnames";
import DataAndLabel from "./DataAndLabel";
import { ParsingResult } from "../parser/Parser";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  parsingOutput: ParsingResult | null;
  className?: string;
};

export default function FileUploadAndDetails({
  onDrop,
  parsingOutput: parsingResult,
  className,
}: Props) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className={cx("file-upload-and-details", className)}>
      <h3>File</h3>
      <div className="flex-row">
        <div {...getRootProps()} className="input-wrapper">
          <input {...getInputProps()} />
          <p>Drag or Click to Upload File</p>
        </div>
        <div className="file-details">
          {!(parsingResult instanceof Error) && (
            <>
              <DataAndLabel
                label="File Name"
                value={parsingResult?.file.fileName}
              />
              <DataAndLabel
                label="File Type"
                value={parsingResult?.file.format}
              />
              <DataAndLabel
                label="File Signature"
                value={parsingResult?.fileSignature.signatureAsString}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
