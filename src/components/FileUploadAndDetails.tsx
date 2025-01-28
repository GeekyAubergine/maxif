import { useDropzone } from "react-dropzone";
import cx from "classnames";

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  className?: string;
};

export default function FileUploadAndDetails({ onDrop, className }: Props) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className={cx("file-upload", className)}>
      <h3>File</h3>
      <div {...getRootProps()} className="input-wrapper">
        <input {...getInputProps()} />
        <p>Drag or Click to Upload File</p>
      </div>
    </div>
  );
}
