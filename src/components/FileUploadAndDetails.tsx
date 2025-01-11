import { useDropzone } from "react-dropzone";
import cx from "classnames";
import { FileSignatureMatch } from "../fileSignature/FileSignature";
import DataAndLabel from "./DataAndLabel";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  signatureMatch: FileSignatureMatch | null;
  className?: string;
};

export default function FileUploadAndDetails({
  onDrop,
  signatureMatch,
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
          <DataAndLabel
            label="File Name"
            value={signatureMatch ? signatureMatch.fileName : "-"}
          />
          <DataAndLabel
            label="File Type"
            value={signatureMatch ? signatureMatch.fileSignature.format : "-"}
          />
        </div>
      </div>
    </div>
  );
}
