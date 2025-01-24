import { FileDataReader } from "../files/FileDataReader";
import { FileSignatureMatchResult } from "../files/FileSignature";

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
  file: {
    format: string;
    description: string;
    fileName: string;
    lastModified: Date;
    size: number;
  };
  fileSignature: FileSignatureMatchResult;
};

export type ParsingResult = ParserOutput | ParserError;

export interface Parser {
  canReadFile(file: FileDataReader): FileSignatureMatchResult | false;
  parse(file: FileDataReader): ParsingResult;
}
