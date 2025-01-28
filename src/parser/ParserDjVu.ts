import { DataViewWithCursor } from "../files/FileDataReader";
import { FILE_SIGNATURE_OAR } from "../files/FileSignature";
import { Parser, PARSERS, ParsingResult } from "./Parser";

export class ParserDjVu implements Parser {
  register() {
    PARSERS[FILE_SIGNATURE_OAR.name] = this;
  }

  parse(data: DataViewWithCursor): ParsingResult {
    data.skip(16);

    const multiPageMarkerByte = data.consumeUint8();

    return {
      metadata: {
        Multipage: multiPageMarkerByte === 0x4d ? "True" : "False",
      },
    };
  }
}
