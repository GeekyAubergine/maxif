import { FileDataReader } from "../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../Parser";

const SIGNATURE = new FileSignature("53 50 30 31");

export class ParserAmazonKindleUpdate implements Parser {
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
        format: "Amazon Kindle Update Package",
        description: "An update package for Amazon Kindle devices",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
