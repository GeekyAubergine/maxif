import { FileDataReader } from "../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../Parser";

const SIGNATURE = new FileSignature(
  "02 00 5a 57 52 54 00 00 00 00 00 00 00 00 00 00",
);

export class ParserClarisWorksWordProcessingDoc implements Parser {
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
        format: "ClarisWorks Word Processing Document",
        description: "ClarisWorks Word Processing Document",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
