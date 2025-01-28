import { DataViewWithCursor } from "../files/FileDataReader";
import { ParserDjVu } from "./ParserDjVu";
import { ParserOAR } from "./ParserOAR";
import { ParserWebP } from "./ParserWebP";

export class ParserError extends Error {
  readonly message: string;

  readonly byteIndex: number;

  readonly dataSlice: Uint8Array;

  constructor(message: string, byteIndex: number, dataSlice: Uint8Array) {
    super(message);
    this.message = message;
    this.byteIndex = byteIndex;
    this.dataSlice = dataSlice;
  }
}

export type ParserOutput = {
  metadata: Record<string, string>;
};

export type ParsingResult = ParserOutput | ParserError;

export interface Parser {
  register(): void;
  parse(data: DataViewWithCursor): ParsingResult;
}

export const PARSERS: Record<string, Parser> = {};

new ParserDjVu().register();
new ParserOAR().register();
new ParserWebP().register();
