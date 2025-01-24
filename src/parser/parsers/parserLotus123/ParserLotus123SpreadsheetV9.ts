import { FileDataReader } from "../../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../../Parser";

const SIGNATURE = new FileSignature("00 00 1A 00 05 10 04");

export class Lotus123SpreadsheetV9 implements Parser {
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
        format: "Lotus 1-2-3 Spreadsheet V9",
        description: "Lotus 1-2-3 Spreadsheet V9",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
