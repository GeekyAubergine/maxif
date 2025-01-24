import { FileDataReader } from "../../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../../Parser";

const SIGNATURE = new FileSignature(
  "00 00 02 00 06 04 06 00 08 00 00 00 00 00",
);

export class Lotus123SpreadsheetV1 implements Parser {
  canReadFile(file: FileDataReader): FileSignatureMatchResult | false {
    return SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult {
    const magicNumber = this.canReadFile(file);

    if (!magicNumber) {
      return new ParserError("Invalid file format", -1, new Uint8Array());
    }

    return {
      file: {
        format: "Lotus 1-2-3 Spreadsheet V1",
        description: "Lotus 1-2-3 Spreadsheet V1",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
