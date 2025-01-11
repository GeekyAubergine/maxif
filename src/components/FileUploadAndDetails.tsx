import { useDropzone } from "react-dropzone";
import cx from "classnames";
import DataAndLabel from "./DataAndLabel";
import { ParsingResult } from "../parser/Parser";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  parsingResult: ParsingResult | null;
  className?: string;
};

export default function FileUploadAndDetails({
  onDrop,
  parsingResult,
  className,
}: Props) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const fileName =
    parsingResult != null && !(parsingResult instanceof Error)
      ? parsingResult.file.fileName
      : null;

  const fileType =
    parsingResult != null && !(parsingResult instanceof Error)
      ? parsingResult.file.format
      : null;

  return (
    <div className={cx("file-upload-and-details", className)}>
      <h3>File</h3>
      <div className="flex-row">
        <div {...getRootProps()} className="input-wrapper">
          <input {...getInputProps()} />
          <p>Drag or Click to Upload File</p>
        </div>
        <div className="file-details">
          <DataAndLabel label="File Name" value={fileName} />
          <DataAndLabel label="File Type" value={fileType} />
        </div>
      </div>
    </div>
  );
}
