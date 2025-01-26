import { FileDataReader } from "../../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../../Parser";

const PNG_SIGNATURE = new FileSignature("89 50 4E 47 0D 0A 1A 0A");

export class ParserPng implements Parser {
  public readonly fileSignature = PNG_SIGNATURE;

  canReadFile(file: FileDataReader): FileSignatureMatchResult | false {
    return PNG_SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult {
    const magicNumber = this.canReadFile(file);

    if (!magicNumber) {
      return new ParserError("Invalid file format", -1, new Uint8Array());
    }

    return {
      file: {
        format: "PNG",
        description: "PNG image",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
