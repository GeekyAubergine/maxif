import { FileDataReader } from "../files/FileDataReader";
import { FileSignature, FileSignatureMatchResult } from "../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "./Parser";

const JPEG_SIGNATURE = new FileSignature("FF D8 FF DB");
const JPEG_SIGNATURE_2 = new FileSignature("FF D8 FF EE");
const JPEG_SIGNATURE_3 = new FileSignature("FF D8 FF E0");

export class ParserJpeg implements Parser {
  canReadFile(file: FileDataReader): FileSignatureMatchResult | false {
    return (
      JPEG_SIGNATURE.matches(file) ||
      JPEG_SIGNATURE_2.matches(file) ||
      JPEG_SIGNATURE_3.matches(file)
    );
  }

  parse(file: FileDataReader): ParsingResult | ParserError {
    const fileSignature = this.canReadFile(file);

    if (!fileSignature) {
      return new ParserError("Invalid file format", -1, new Uint8Array());
    }

    return {
      file: {
        format: "JPEG",
        description: "JPEG image",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: fileSignature,
    };
  }
}
