import { FileDataReader } from "../../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../../Parser";

const SIGNATURE = new FileSignature("47 49 46 38 37 61");
const SIGNATURE_2 = new FileSignature("47 49 46 38 39 61");

export class ParserGif implements Parser {
  public readonly fileSignature = SIGNATURE;

  canReadFile(file: FileDataReader): FileSignatureMatchResult | false {
    return SIGNATURE.matches(file) || SIGNATURE_2.matches(file);
  }

  parse(file: FileDataReader): ParsingResult {
    const magicNumber = this.canReadFile(file);

    if (!magicNumber) {
      return new ParserError("Invalid file format", -1, new Uint8Array());
    }

    return {
      file: {
        format: "GIF",
        description: "Graphics Interchange Format",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
