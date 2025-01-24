import { FileDataReader } from "../../files/FileDataReader";
import {
  FileSignature,
  FileSignatureMatchResult,
} from "../../files/FileSignature";
import { Parser, ParserError, ParsingResult } from "../Parser";

const SIGNATURE = new FileSignature("0A 0D 0D 0A");

export class ParserPCAPNextGenDumpFile implements Parser {
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
        format: "PCAP NextGen Dump File",
        description: "PCAP NextGen Dump File",
        fileName: file.fileName(),
        lastModified: file.lastModified(),
        size: file.size(),
      },
      fileSignature: magicNumber,
    };
  }
}
