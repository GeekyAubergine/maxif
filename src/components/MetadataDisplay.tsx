import { useCallback, useMemo } from "react";
import cx from "classnames";
import { ParserError, ParsingResult } from "../parser/Parser";
import DataAndLabel from "./DataAndLabel";

type Props = {
  parsingResult: ParsingResult | null;
  className?: string;
};

type MetadataElement = {
  label: string;
  value: string;
};

export default function MetadataDisplay({ parsingResult, className }: Props) {
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
    <div className={cx("metadata-display", className)}>
      <h3>Metadata</h3>
      <div className="metadata-elements">
        {metadataElements.map(renderMetadataElement)}
      </div>
    </div>
  );
}
