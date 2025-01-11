import { FileDataReader } from "../entities/FileDataReader";
import { MagicNumber, MagicNumberResult } from "../magicNumber/MagicNumber";
import { Parser, ParserError, ParsingResult } from "./Parser";

const PNG_SIGNATURE = new MagicNumber("89 50 4E 47 0D 0A 1A 0A");

export class ParserPng implements Parser {
  public readonly fileSignature = PNG_SIGNATURE;

  canReadFile(file: FileDataReader): MagicNumberResult | false {
    return PNG_SIGNATURE.matches(file);
  }

  parse(file: FileDataReader): ParsingResult | ParserError {
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
      magicNumber,
    };
  }
}
