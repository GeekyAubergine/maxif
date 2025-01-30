import { DataViewWithCursor } from "../files/FileDataReader";
import { FILE_SIGNATURE_OAR } from "../files/FileSignature";
import { Parser, PARSERS, ParsingResult } from "./Parser";

export class ParserOAR implements Parser {
  register() {
    PARSERS[FILE_SIGNATURE_OAR.name] = this;
  }

  parse(data: DataViewWithCursor): ParsingResult {
    data.skip(3);

    const formatVersion = data.consumeUint8();

    return {
      metadata: {
        "Format version": String(formatVersion),
      },
    };
  }
}
