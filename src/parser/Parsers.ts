import { FileDataReader } from "../entities/FileDataReader";
import { Parser, ParserError, ParsingResult } from "./Parser";
import { ParserJpeg } from "./ParserJpeg";
import { ParserJpegExif } from "./ParserJpegExif";
import { ParserPng } from "./ParserPng";

export const PARSERS: Parser[] = [
  new ParserJpeg(),
  new ParserJpegExif(),
  new ParserJpeg(),
  new ParserPng(),
];

export function parseFile(file: FileDataReader): ParsingResult | ParserError {
  for (const parser of PARSERS) {
    const result = parser.canReadFile(file);

    if (result) {
      return parser.parse(file);
    }
  }

  return new ParserError("Unknown file format", -1, new Uint8Array());
}
