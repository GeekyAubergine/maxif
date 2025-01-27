import { useDropzone } from "react-dropzone";
import cx from "classnames";
import DataAndLabel from "./DataAndLabel";
import { FileSignatureMatchResult } from "../files/FileSignature";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  file: File | null;
  fileSignatureMatchResult: FileSignatureMatchResult;
  className?: string;
};

export default function FileUploadAndDetails({
  onDrop,
  file,
  fileSignatureMatchResult,
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
          {file != null && (
            <>
              <DataAndLabel label="File Name" value={file?.name} />
            </>
          )}
          {fileSignatureMatchResult !== false && (
            <>
              <DataAndLabel
                label="File Type"
                value={fileSignatureMatchResult.name}
              />
              <DataAndLabel
                label="File Signature"
                value={fileSignatureMatchResult.signatureAsString}
              />
              <DataAndLabel
                label="File Signature Offset"
                value={String(fileSignatureMatchResult.signatureOffset)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
