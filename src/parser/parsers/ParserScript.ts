import { FileDataReader } from "../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../Parser";

const SCRIPT_SIGNATURE = new FileSignature("23 21");

export class ParserScript implements Parser {
  canReadFile(file: FileDataReader): FileSignatureMatchResult | false {
    return SCRIPT_SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult {
    const magicNumber = this.canReadFile(file);

    if (!magicNumber) {
      return new ParserError("Invalid file format", -1, new Uint8Array());
    }

    return {
      file: {
        format: "Script",
        description: "A script file",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
