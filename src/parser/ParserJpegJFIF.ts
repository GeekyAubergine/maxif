import { FileDataReader } from "../entities/FileDataReader";
import { MagicNumber, MagicNumberResult } from "../magicNumber/MagicNumber";
import { Parser, ParserError, ParsingResult } from "./Parser";

const JPEG_JFIF_SIGNATURE = new MagicNumber("FF D8 FF E0 ?? ?? 4A 46 49 46 00");

export class ParserJpegJFIF implements Parser {
  canReadFile(file: FileDataReader): MagicNumberResult | false {
    return JPEG_JFIF_SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult | ParserError {
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
      magicNumber,
    };
  }
}
