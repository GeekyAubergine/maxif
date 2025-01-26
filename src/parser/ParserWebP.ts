import { DataViewWithCursor } from "../files/FileDataReader";
import { FILE_SIGNATURE_WEBP } from "../files/FileSignature";
import { bytesSizeToHumanReadable } from "../utils";
import { Parser, PARSERS, ParsingResult } from "./Parser";

// https://developers.google.com/speed/webp/docs/riff_container

export class ParserWebP implements Parser {
  register() {
    PARSERS[FILE_SIGNATURE_WEBP.name] = this;
  }

  parse(data: DataViewWithCursor): ParsingResult {
    data.skip(4);

    const fileSize = data.consumeUint32(true) + 12;

    console.log(fileSize);

    return {
      metadata: {
        "File Size": bytesSizeToHumanReadable(fileSize),
        "File Size Bytes": String(fileSize),
      },
    };
  }
}
