import { DataViewWithCursor } from "../files/FileDataReader";
import { FILE_SIGNATURE_OAR } from "../files/FileSignature";
import { Parser, PARSERS, ParsingResult } from "./Parser";

// https://developers.google.com/speed/webp/docs/riff_container

export class ParserOAR implements Parser {
  register() {
    PARSERS[FILE_SIGNATURE_OAR.name] = this;
  }

  parse(data: DataViewWithCursor): ParsingResult {
    data.skip(3);

    const formatVersion = data.consumeUint8();

    console.log(formatVersion);

    return {
      metadata: {
        "Format version": String(formatVersion),
      },
    };
  }
}
