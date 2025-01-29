import { useCallback, useMemo } from "react";
import cx from "classnames";
import { ParserError, ParsingResult } from "../parser/Parser";
import DataAndLabel from "./DataAndLabel";
import { FileSignatureMatchResult } from "../files/FileSignature";

type Props = {
  file: File | null;
  fileSignatureMatchResult: FileSignatureMatchResult;
  parsingResult: ParsingResult | null;
  className?: string;
};

type MetadataElement = {
  label: string;
  value: string;
};

export default function FileDataDisplay({
  file,
  fileSignatureMatchResult,
  parsingResult,
  className,
}: Props) {
  const metadataElements: MetadataElement[] = useMemo(() => {
    if (parsingResult == null) {
      return [];
    }

    if (parsingResult instanceof ParserError) {
      return [];
    }

    return Object.entries(parsingResult.metadata).map(
      ([key, value]: [string, string]) => {
        return { label: key, value };
      },
    );
  }, [parsingResult]);

  const renderMetadataElement = useCallback(
    (metadataElement: MetadataElement) => (
      <DataAndLabel
        key={metadataElement.label}
        label={metadataElement.label}
        value={metadataElement.value}
      />
    ),
    [],
  );

  return (
    <div className={cx("file-data-display", className)}>
      <h3>File Data</h3>
      <DataAndLabel label="File Name" value={file?.name ?? "-"} />
      <DataAndLabel
        label="File Type"
        value={fileSignatureMatchResult ? fileSignatureMatchResult.name : "-"}
      />
      <DataAndLabel
        label="File Signature"
        value={
          fileSignatureMatchResult
            ? fileSignatureMatchResult.signatureAsString
            : "-"
        }
      />
      <DataAndLabel
        label="File Signature Offset"
        value={String(
          fileSignatureMatchResult
            ? fileSignatureMatchResult.signatureOffset
            : "-",
        )}
      />
      {metadataElements.map(renderMetadataElement)}
    </div>
  );
}
