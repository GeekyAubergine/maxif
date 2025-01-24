import { FileDataReader } from "../../../files/FileDataReader";
import { FileSignature, FileSignatureMatchResult } from "../../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../../Parser";

const JPEG_EXIF_SIGNATURE = new FileSignature("FF D8 FF E1 ?? ?? 45 78 69 66 00");

export class ParserJpegExif implements Parser {
  canReadFile(file: FileDataReader): FileSignatureMatchResult | false {
    return JPEG_EXIF_SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult {
    const magicNumber = this.canReadFile(file);

    if (!magicNumber) {
      return new ParserError("Invalid file format", -1, new Uint8Array());
    }

    return {
      file: {
        format: "JPEG EXIF",
        description: "JPEG image with EXIF metadata",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
