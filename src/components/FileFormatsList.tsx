import cx from "classnames";
import { FileSignature } from "../files/FileSignature";
import { useCallback } from "react";
type Props = {
  className?: string;
};

function FileSignatureRow({ signature }: { signature: FileSignature }) {
  return (
    <tr>
      <td className="name">{signature.name}</td>
      <td className="signature uppercase">{signature.signatureAsString}</td>
      <td className="offset">{signature.offset}</td>
    </tr>
  );
}

export default function FileFormatsList({ className }: Props) {
  const renderFileSignature = useCallback(
    (signature: FileSignature) => (
      <FileSignatureRow
        key={signature.signatureAsString}
        signature={signature}
      />
    ),
    [],
  );

  return (
    <div className={cx("file-formats-list", className)}>
      <table className="formats-list">
        <thead>
          <tr>
            <th className="name">Name</th>
            <th className="signature">Signature</th>
            <th className="offset">Offset</th>
          </tr>
        </thead>
        <tbody>{FileSignature.FILE_SIGNATURES.map(renderFileSignature)}</tbody>
      </table>
    </div>
  );
}
