import { useMemo } from "react";
import cx from "classnames";
import { FileSignatureMatch } from "../fileSignature/FileSignature";

const BUFFER_LENGTH_TO_SHOW = 32;

type Props = {
  buffer: Uint8Array;
  signatureMatch: FileSignatureMatch | null;
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
  signatureMatch,
  className,
}: Props) {
  const bufferElements = useMemo(() => {
    const out = [];

    console.log(signatureMatch);

    for (let i = 0; i < BUFFER_LENGTH_TO_SHOW; i++) {
      const selected =
        signatureMatch != null
          ? i >= signatureMatch.start && i < signatureMatch.end
          : false;

      out.push(<HexByte key={i} byte={buffer[i]} selected={selected} />);
    }

    return out;
  }, [buffer, signatureMatch]);

  return (
    <div className={cx("hex-display", className)}>
      <h3>Hex</h3>
      <div className="bytes">{bufferElements}</div>
    </div>
  );
}
