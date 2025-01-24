import { FileDataReader } from "../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../Parser";

const SIGNATURE = new FileSignature("49 57 41 44");

export class ParserInternalWad implements Parser {
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
        format: "Internal WAD",
        description: "Internal WAD. Resource file in Doom",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
