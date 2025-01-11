import { FileDataReader } from "../entities/FileDataReader";
import { MagicNumber, MagicNumberResult } from "../magicNumber/MagicNumber";
import { Parser, ParserError, ParsingResult } from "./Parser";

const JPEG_EXIF_SIGNATURE = new MagicNumber("FF D8 FF E1 ?? ?? 45 78 69 66 00");
export class ParserJpegExif implements Parser {
  canReadFile(file: FileDataReader): MagicNumberResult | false {
    return JPEG_EXIF_SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult | ParserError {
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
      magicNumber,
    };
  }
}
