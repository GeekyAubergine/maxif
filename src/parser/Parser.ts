import { FileDataReader } from "../entities/FileDataReader";
import { MagicNumberResult } from "../magicNumber/MagicNumber";

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

export type ParsingResult = {
  file: {
    format: string;
    description: string;
    fileName: string;
    lastModified: Date;
    size: number;
  };
  magicNumber: MagicNumberResult;
} | ParserError;

export interface Parser {
  canReadFile(file: FileDataReader): MagicNumberResult | false;
  parse(file: FileDataReader): ParsingResult;
}
