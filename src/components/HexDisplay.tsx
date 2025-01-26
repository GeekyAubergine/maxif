import { useMemo } from "react";
import cx from "classnames";
import { FileSignatureMatchResult } from "../files/FileSignature";

const BUFFER_LENGTH_TO_SHOW = 32;

type Props = {
  buffer: Uint8Array;
  fileSignatureMatchResult: FileSignatureMatchResult;
  className?: string;
};

function HexByte({
  byte,
  selected,
}: {
  byte: number | null;
  selected: boolean;
}) {
  return (
    <p className={selected ? "byte selected" : "byte"}>
      {byte ? byte.toString(16).padStart(2, "0") : "00"}
    </p>
  );
}

export default function HexDisplay({
  buffer,
  fileSignatureMatchResult,
  className,
}: Props) {
  const bufferElements = useMemo(() => {
    const out = [];

    console.log(fileSignatureMatchResult);

    for (let i = 0; i < BUFFER_LENGTH_TO_SHOW; i++) {
      const selected =
        fileSignatureMatchResult !== false
          ? fileSignatureMatchResult.relevantBytes.includes(i)
          : false;

      out.push(<HexByte key={i} byte={buffer[i]} selected={selected} />);
    }

    return out;
  }, [buffer, fileSignatureMatchResult]);

  return (
    <div className={cx("hex-display", className)}>
      <h3>Hex</h3>
      <div className="bytes">{bufferElements}</div>
    </div>
  );
}
