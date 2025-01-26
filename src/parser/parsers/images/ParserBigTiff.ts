import { FileDataReader } from "../../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../../Parser";

const SIGNATURE = new FileSignature("4D 4D 00 2B");

export class ParserBigTiff implements Parser {
  public readonly fileSignature = SIGNATURE;

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
        format: "BigTIFF",
        description: "Big Tagged Image File Format",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
