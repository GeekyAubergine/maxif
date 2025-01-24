import { useMemo } from "react";
import cx from "classnames";
import { ParserError, ParsingResult } from "../parser/Parser";

const BUFFER_LENGTH_TO_SHOW = 32;

type Props = {
  buffer: Uint8Array;
  parsingResult: ParsingResult | null;
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
  parsingResult,
  className,
}: Props) {
  const bufferElements = useMemo(() => {
    const out = [];

    console.log(parsingResult);

    for (let i = 0; i < BUFFER_LENGTH_TO_SHOW; i++) {
      const selected =
        parsingResult != null && !(parsingResult instanceof ParserError)
          ? parsingResult.fileSignature.relevantBytes.includes(i)
          : false;

      out.push(<HexByte key={i} byte={buffer[i]} selected={selected} />);
    }

    return out;
  }, [buffer, parsingResult]);

  return (
    <div className={cx("hex-display", className)}>
      <h3>Hex</h3>
      <div className="bytes">{bufferElements}</div>
    </div>
  );
}
