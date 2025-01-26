import { FileDataReader } from "../../../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../../../Parser";

const JPEG_JFIF_SIGNATURE = new FileSignature(
  "FF D8 FF E0 ?? ?? 4A 46 49 46 00",
);

export class ParserJpegJFIF implements Parser {
  canReadFile(file: FileDataReader): FileSignatureMatchResult | false {
    return JPEG_JFIF_SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult {
    const magicNumber = this.canReadFile(file);

    if (!magicNumber) {
      return new ParserError("Invalid file format", -1, new Uint8Array());
    }

    return {
      file: {
        format: "JPEG JFIF",
        description: "JPEG image with JFIF metadata",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
