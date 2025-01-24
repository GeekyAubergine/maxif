import { FileDataReader } from "../files/FileDataReader";
import { ParserAmigaHunk } from "./parsers/ParserAmigaHunk";
import { Parser, ParserError, ParserOutput } from "./Parser";
import { ParserClarisWorksWordProcessingDoc } from "./parsers/ParserClarisWorksWordProcessingDoc";
import { ParserJpeg } from "./parsers/parserJpeg/ParserJpeg";
import { ParserJpegExif } from "./parsers/parserJpeg/ParserJpegExif";
import { Lotus123SpreadsheetV1 as ParserLotus123SpreadsheetV1 } from "./parsers/parserLotus123/ParserLotus123SpreadsheetV1";
import { Lotus123SpreadsheetV3 as ParserLotus123SpreadsheetV3 } from "./parsers/parserLotus123/ParserLotus123SpreadsheetV3";
import { Lotus123SpreadsheetV45 as ParserLotus123SpreadsheetV45 } from "./parsers/parserLotus123/ParserLotus123SpreadsheetV45";
import { Lotus123SpreadsheetV9 as ParserLotus123SpreadsheetV9 } from "./parsers/parserLotus123/ParserLotus123SpreadsheetV9";
import { ParserPng } from "./parsers/ParserPng";
import { ParserScript } from "./parsers/ParserScript";
import { ParserQuarkExpress } from "./parsers/ParserQuarkExpress";
import { ParserPasswordGorillaPasswordDatabase } from "./parsers/ParserPasswordGorillaPasswordDatabase";
import { ParserLibpcapFileFormat } from "./parsers/libpcap/ParserLibpcapFileFormat";
import { ParserLibpcapFileFormatNS } from "./parsers/libpcap/ParserLibpcapFileFormatNS";
import { ParserPCAPNextGenDumpFile } from "./parsers/ParserPCAPNextGenDumpFile";
import { ParserRedHatPackageManagerPackage } from "./parsers/ParserRedHatPackageManagerPackage";
import { ParserSQLiteDatabase } from "./parsers/ParserSQLiteDatabase";
import { ParserAmazonKindleUpdate } from "./parsers/ParserAmazonKindleUpdatePackage";
import { ParserInternalWad } from "./parsers/ParserInternalWad";

// Order taken from https://en.wikipedia.org/wiki/List_of_file_signatures

export const PARSERS: Parser[] = [
  new ParserScript(),
  new ParserClarisWorksWordProcessingDoc(),
  new ParserLotus123SpreadsheetV1(),
  new ParserLotus123SpreadsheetV3(),
  new ParserLotus123SpreadsheetV45(),
  new ParserLotus123SpreadsheetV9(),
  new ParserAmigaHunk(),
  new ParserQuarkExpress(),
  new ParserPasswordGorillaPasswordDatabase(),
  new ParserLibpcapFileFormat(),
  new ParserLibpcapFileFormatNS(),
  new ParserPCAPNextGenDumpFile(),
  new ParserRedHatPackageManagerPackage(),
  new ParserSQLiteDatabase(),
  new ParserAmazonKindleUpdate(),
  new ParserInternalWad(),
  new ParserJpeg(),
  new ParserJpegExif(),
  new ParserJpeg(),
  new ParserPng(),
];

export function parseFile(file: FileDataReader): ParserOutput | ParserError {
  let bestParser: Parser | null = null;
  let longestMatch = 0;

  for (const parser of PARSERS) {
    const result = parser.canReadFile(file);

    if (result && result.relevantBytes.length > longestMatch) {
      bestParser = parser;
      longestMatch = result.relevantBytes.length;
    }
  }

  if (bestParser) {
    return bestParser.parse(file);
  }

  return new ParserError("Unknown file format", -1, new Uint8Array());
}
